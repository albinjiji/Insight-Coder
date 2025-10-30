import { createAsyncThunk } from "@reduxjs/toolkit";
import { ChatState, Message } from "./chat-slice";
import { v4 as uuidv4 } from 'uuid';

import { newChat, addMessage, setTitle, setPendingClarify } from "./chat-slice";
import { answerCodingPromptOrFallback, clarifyIfNeeded, correctPrompt, generateAnswerWithFallback, normalizeClarifyAnswerSimple } from "@/lib/gemini-helper";

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

  // 2) If we’re answering a previous Clarify, use fast-path
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

    const fixed  = await correctPrompt(combined);
    const answer = await generateAnswerWithFallback(fixed);
    const final  = await clarifyIfNeeded(fixed, answer);

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