import { createAsyncThunk } from "@reduxjs/toolkit";
import { ChatState, Message } from "./chat-slice";
import { v4 as uuidv4 } from 'uuid';

import { newChat, addMessage, setTitle, setPendingClarify, setResponse } from "./chat-slice";
import { answerCodingPromptOrFallback, clarifyIfNeeded, correctPrompt, generateAnswerWithFallback, normalizeClarifyAnswerSimple, postGemini, requestWithRetries, streamGemini } from "@/lib/gemini-helper";
import { modePrompts, modelOptions } from "@/constants/frontend-constants";
import { AuthState } from "../auth/auth-slice";
import {
  loadSessions,
  loadMessages,
  createSession,
  updateSession,
  saveMessage,
  checkSessionExists,
  deleteSession,
} from "@/lib/supabase/chat-db";

// ─── Load sessions from Supabase on mount ───────────────────────────

export const loadUserSessions = createAsyncThunk<
  { id: string; mode: string; model: string; preview: string; repoUrl: string; isRepoConnected: boolean; timestamp: string; messages: Message[] }[],
  void,
  { state: { chat: ChatState; auth: AuthState } }
>('chat/loadUserSessions', async (_, { getState }) => {
  const user = getState().auth.user;
  if (!user) return [];

  const sessions = await loadSessions(user.id);
  
  // Load messages for each session
  const sessionsWithMessages = await Promise.all(
    sessions.map(async (session) => {
      const msgs = await loadMessages(session.id);
      return {
        id: session.id,
        mode: session.mode,
        model: session.model,
        preview: session.preview || 'New Session',
        repoUrl: session.repo_url || '',
        isRepoConnected: session.is_repo_connected || false,
        timestamp: new Date(session.updated_at || session.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        messages: msgs.map((m: { role: string; text: string }) => ({
          role: m.role as 'user' | 'assistant',
          text: m.text,
        })),
      };
    }),
  );

  return sessionsWithMessages;
});

// ─── Send Message (chat mode) ───────────────────────────────────────

export const sendMessage = createAsyncThunk<
  void,
  { prompt: string },
  { state: { chat: ChatState } }
>('chat/sendMessage', async ({ prompt }, { getState, dispatch }) => {
  const trimmed = prompt.trim();
  if (!trimmed) return;

  const state = getState().chat;

  // Ensure a chat exists
  let chatId = state.currentChatId;
  if (!chatId) {
    dispatch(newChat());
    // re-read state to get newly created chat id
    chatId = (getState().chat.currentChatId as string) ?? uuidv4(); // fallback
  }

  // 1) Push user message immediately
  const userMsg: Message = { role: 'user', text: trimmed };
  dispatch(addMessage({ chatId, message: userMsg }));

  const pending = state.pendingClarify;

  // 2) If we're answering a previous Clarify, use fast-path
  if (pending) {
    const { basePrompt, question } = pending;

    const normalized = normalizeClarifyAnswerSimple(question, trimmed);

    const combined = `
        Original question:
        """${basePrompt}"""

        Assistant asked to clarify:
        ${question}

        User clarification:
        """${normalized}"""

        Please provide the final answer now considering the clarification.
        `.trim();

    const fixed = await correctPrompt(combined);
    const answer = await generateAnswerWithFallback(fixed);
    const final = await clarifyIfNeeded(fixed, answer);

    if (/^\s*Clarify:/i.test(final)) {
      // chain clarify
      dispatch(setPendingClarify({ basePrompt, question: final }));
      const assistantMsg: Message = { role: 'assistant', text: final };
      dispatch(addMessage({ chatId, message: assistantMsg }));
      return;
    }

    // final answer
    dispatch(setPendingClarify(null));
    const assistantMsg: Message = { role: 'assistant', text: final };
    dispatch(addMessage({ chatId, message: assistantMsg }));

    // auto-title if needed (first turn)
    const chat = getState().chat.chats.find(c => c.id === chatId);
    if (chat && chat.title === 'New Chat') {
      dispatch(setTitle({ chatId, title: basePrompt.slice(0, 30) }));
    }
    return;
  }

  // 3) Normal pipeline
  const aiText = await answerCodingPromptOrFallback(trimmed);

  if (/^\s*Clarify:/i.test(aiText)) {
    dispatch(setPendingClarify({ basePrompt: trimmed, question: aiText }));
  }

  const assistantMsg: Message = { role: 'assistant', text: aiText };
  dispatch(addMessage({ chatId, message: assistantMsg }));

  // auto-title
  const chat = getState().chat.chats.find(c => c.id === chatId);
  if (chat && chat.title === 'New Chat') {
    dispatch(setTitle({ chatId, title: trimmed.slice(0, 30) }));
  }
});

// ─── Analyze Code (IDE modes) with Supabase persistence ─────────────

export const analyzeCode = createAsyncThunk<
  string,
  void,
  { state: { chat: ChatState; auth: AuthState }; rejectValue: string }
>('chat/analyzeCode', async (_, { getState, dispatch, rejectWithValue }) => {
  const state = getState().chat;
  const { selectedMode, selectedModel } = state;
  const code = state.modeStates[selectedMode].code;

  if (!code.trim()) {
    return rejectWithValue('Please enter some code to analyze.');
  }

  const systemPrompt = modePrompts[selectedMode];
  const modelConfig = modelOptions.find(m => m.id === selectedModel);
  const modelName = modelConfig?.modelName || 'gemini-2.0-flash';

  const messages = state.modeStates[selectedMode].messages;
  
  // Format history for context (exclude the very last user message as it's the "Current Task")
  const historyContext = messages.length > 1
    ? `\nCONVERSATION HISTORY:\n${messages.slice(0, -1).map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join('\n')}\n`
    : '';

  const fullPrompt = `${systemPrompt}
${historyContext}
CURRENT TASK/CODE (USE THIS TO ANSWER):
\`\`\`
${code}
\`\`\``;

  // Try streaming first for faster perceived response
  try {
    const finalText = await streamGemini(
      fullPrompt,
      modelName as Parameters<typeof postGemini>[1],
      (accumulated) => {
        // Progressively update response as chunks arrive
        dispatch(setResponse(accumulated));
      },
    );

    // ──── Persist to Supabase after successful analysis ────
    try {
      const authState = getState().auth;
      const userId = authState.user?.id;
      if (userId) {
        const chatState = getState().chat;
        const activeId = chatState.activeHistoryId;
        
        // Determine session ID
        let sessionId = activeId || uuidv4();

        // Explicitly check if this session exists in Supabase
        const exists = await checkSessionExists(sessionId);

        if (exists) {
          // Session exists — just update metadata
          await updateSession(sessionId, {
            preview: code.trim().slice(0, 60) || 'Active session',
            repoUrl: chatState.modeStates[selectedMode].repoUrl,
            isRepoConnected: chatState.modeStates[selectedMode].isRepoConnected,
          });
          // Save only the new user input (it was already added to Redux history, 
          // but not yet to the DB for this existing session)
          await saveMessage(sessionId, 'user', code);
        } else {
          // Session doesn't exist — create it first
          await createSession(userId, {
            id: sessionId,
            mode: selectedMode,
            model: selectedModel,
            preview: code.trim().slice(0, 60) || 'New Session',
            repoUrl: chatState.modeStates[selectedMode].repoUrl,
            isRepoConnected: chatState.modeStates[selectedMode].isRepoConnected,
          });
          // Save all existing in-memory messages (including the user input that started this)
          for (const msg of chatState.modeStates[selectedMode].messages) {
            await saveMessage(sessionId, msg.role, msg.text);
          }
        }

        // Save the assistant response
        await saveMessage(sessionId, 'assistant', finalText);
      }
    } catch (dbError: unknown) {
      // Don't fail the analysis if DB persistence fails
      const errMsg = dbError instanceof Error ? dbError.message : JSON.stringify(dbError);
      console.error('Failed to persist to Supabase:', errMsg);
    }

    return finalText;
  } catch {
    // Fallback to non-streaming if stream fails
    try {
      const { text } = await requestWithRetries(fullPrompt, [modelName as Parameters<typeof postGemini>[1], 'gemini-2.5-flash', 'gemini-3.1-flash-lite-preview']);
      return text || 'No response received.';
    } catch {
      return rejectWithValue('The Gemini models are currently busy or you have reached your free tier limit. Please wait a few seconds or check your terminal console for the specific error details.');
    }
  }
});

// ─── Delete Chat Session ──────────────────────────────────────────

export const deleteChatSession = createAsyncThunk<
  string,
  string,
  { state: { chat: ChatState } }
>('chat/deleteChatSession', async (sessionId, { dispatch }) => {
  await deleteSession(sessionId);
  return sessionId;
});