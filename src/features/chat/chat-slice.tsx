import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';
import { sendMessage, analyzeCode, loadUserSessions, deleteChatSession } from "./chat-thunks";
import { EditorLanguage, FeatureMode, ModelId } from "@/constants/frontend-constants";

type Role = 'user' | 'assistant';

export interface Message {
    role: Role;
    text: string;
}

interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    createdAt: string;
}

export interface HistoryItem {
    id: string;
    mode: FeatureMode;
    messages: Message[];
    model: ModelId;
    timestamp: string;
    preview: string;
    repoUrl?: string;
    isRepoConnected?: boolean;
}

type PendingClarify = { basePrompt: string; question: string } | null;

// Per-mode state: each mode keeps its own code, response, loading status, and last request
export interface LastRequest {
    code: string;
    mode: FeatureMode;
    model: ModelId;
}

export interface ModeState {
    code: string;
    response: string;
    messages: Message[];
    isLoading: boolean;
    lastRequest: LastRequest | null;
    repoUrl: string;
    isRepoConnected: boolean;
}

function createDefaultModeState(): ModeState {
    return { 
        code: '', 
        response: '', 
        messages: [], 
        isLoading: false, 
        lastRequest: null,
        repoUrl: '',
        isRepoConnected: false
    };
}

export type ModeStates = Record<FeatureMode, ModeState>;

export interface ChatState {
    chats: ChatSession[];
    currentChatId: string | null;
    activeHistoryId: string | null;
    pendingClarify: PendingClarify;
    // IDE panel state
    selectedMode: FeatureMode;
    selectedModel: ModelId;
    editorLanguage: EditorLanguage;
    modeStates: ModeStates;
    history: HistoryItem[];
    sessionsLoaded: boolean;
}

const initialState: ChatState = {
    chats: [],
    currentChatId: null,
    activeHistoryId: null,
    pendingClarify: null,
    // IDE panel defaults
    selectedMode: 'explain',
    selectedModel: 'gemini',
    editorLanguage: 'javascript',
    modeStates: {
        explain: createDefaultModeState(),
        review: createDefaultModeState(),
        debug: createDefaultModeState(),
        tests: createDefaultModeState(),
        chat: createDefaultModeState(),
        repo: createDefaultModeState(),
    },
    history: [],
    sessionsLoaded: false,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        newChat(state) {
            const id = uuidv4();
            const chat: ChatSession = {
                id,
                title: 'New Chat',
                messages: [],
                createdAt: new Date().toISOString(),
            };
            state.chats.unshift(chat);
            state.currentChatId = id;
            state.pendingClarify = null;
        },
        selectChat(state, action: PayloadAction<string>) {
            state.currentChatId = action.payload;
            state.pendingClarify = null;
        },
        addMessage(state, action: PayloadAction<{ chatId: string; message: Message }>) {
            const { chatId, message } = action.payload;
            const chat = state.chats.find(c => c.id === chatId);
            chat?.messages.push(message);
        },
        setTitle(state, action: PayloadAction<{ chatId: string; title: string }>) {
            const { chatId, title } = action.payload;
            const chat = state.chats.find(c => c.id === chatId);
            if (chat) chat.title = title;
        },
        setPendingClarify(state, action: PayloadAction<PendingClarify>) {
            state.pendingClarify = action.payload;
        },
        deleteChat(state, action: PayloadAction<string>) {
            const chatId = action.payload;
            state.chats = state.chats.filter(c => c.id !== chatId);
            if (state.currentChatId === chatId) {
                state.currentChatId = state.chats.length > 0 ? state.chats[0].id : null;
                state.pendingClarify = null;
            }
        },
        // IDE panel reducers
        setMode(state, action: PayloadAction<FeatureMode>) {
            state.selectedMode = action.payload;
            state.activeHistoryId = null; // Reset session context when switching modes
        },
        setModel(state, action: PayloadAction<ModelId>) {
            state.selectedModel = action.payload;
        },
        setEditorLanguage(state, action: PayloadAction<EditorLanguage>) {
            state.editorLanguage = action.payload;
            state.modeStates[state.selectedMode].code = '';
        },
        // Per-mode state reducers — target the CURRENT selected mode
        setCode(state, action: PayloadAction<string>) {
            state.modeStates[state.selectedMode].code = action.payload;
        },
        setResponse(state, action: PayloadAction<string>) {
            state.modeStates[state.selectedMode].response = action.payload;
        },
        setModeLoading(state, action: PayloadAction<{ mode: FeatureMode; loading: boolean }>) {
            state.modeStates[action.payload.mode].isLoading = action.payload.loading;
        },
        // Cancel a mode's loading state (used when user confirms mode switch)
        cancelModeLoading(state, action: PayloadAction<FeatureMode>) {
            state.modeStates[action.payload].isLoading = false;
        },
        restoreSession(state, action: PayloadAction<HistoryItem>) {
            const item = action.payload;
            state.selectedMode = item.mode;
            state.selectedModel = item.model;
            state.activeHistoryId = item.id;
            
            // For chat mode, we restore all messages
            state.modeStates[item.mode].messages = item.messages || [];
            
            // Extract the last assistant response and user code for compatibility with simple views
            const lastAssistant = [...item.messages].reverse().find(m => m.role === 'assistant');
            const lastUser = [...item.messages].reverse().find(m => m.role === 'user');
            
            state.modeStates[item.mode].code = lastUser?.text || '';
            state.modeStates[item.mode].response = lastAssistant?.text || '';
            
            state.modeStates[item.mode].lastRequest = {
                code: lastUser?.text || '',
                mode: item.mode,
                model: item.model
            };

            state.modeStates[item.mode].repoUrl = item.repoUrl || '';
            state.modeStates[item.mode].isRepoConnected = item.isRepoConnected || false;
        },
        newSession(state) {
            state.modeStates[state.selectedMode] = createDefaultModeState();
            state.activeHistoryId = null;
        },
        deleteHistorySession(state, action: PayloadAction<string>) {
            const sessionId = action.payload;
            state.history = state.history.filter((h: HistoryItem) => h.id !== sessionId);
            if (state.activeHistoryId === sessionId) {
                state.activeHistoryId = null;
                state.modeStates[state.selectedMode] = createDefaultModeState();
            }
        },
        setRepoUrl(state, action: PayloadAction<string>) {
            state.modeStates[state.selectedMode].repoUrl = action.payload;
        },
        setRepoConnected(state, action: PayloadAction<boolean>) {
            state.modeStates[state.selectedMode].isRepoConnected = action.payload;
        },
        addMessageToHistory(state, action: PayloadAction<{ mode: FeatureMode; text: string }>) {
            const { mode, text } = action.payload;
            const userMsg: Message = { role: 'user', text };
            state.modeStates[mode].messages.push(userMsg);
            
            // If no active session, create one so this message belongs somewhere
            if (!state.activeHistoryId) {
                const newId = uuidv4();
                state.activeHistoryId = newId;
                state.history.unshift({
                    id: newId,
                    mode: mode,
                    messages: [userMsg],
                    model: state.selectedModel,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    preview: text.trim().slice(0, 60) || 'New Analysis',
                    repoUrl: state.modeStates[mode].repoUrl,
                    isRepoConnected: state.modeStates[mode].isRepoConnected,
                });
            } else {
                // Update existing history item
                const existing = state.history.find(h => h.id === state.activeHistoryId);
                if (existing) {
                    existing.messages.push(userMsg);
                    // Also update repo state in case it changed
                    existing.repoUrl = state.modeStates[mode].repoUrl;
                    existing.isRepoConnected = state.modeStates[mode].isRepoConnected;
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendMessage.pending, state => {
                state.modeStates[state.selectedMode].isLoading = true;
            })
            .addCase(sendMessage.fulfilled, state => {
                state.modeStates[state.selectedMode].isLoading = false;
            })
            .addCase(sendMessage.rejected, state => {
                state.modeStates[state.selectedMode].isLoading = false;
            })
            .addCase(analyzeCode.pending, state => {
                const mode = state.selectedMode;
                state.modeStates[mode].isLoading = true;
                state.modeStates[mode].response = '';
            })
            .addCase(analyzeCode.fulfilled, (state, action) => {
                const mode = state.selectedMode;
                state.modeStates[mode].isLoading = false;
                state.modeStates[mode].response = action.payload;

                // Create assistant message
                const assistantMsg: Message = { role: 'assistant', text: action.payload };

                // Add to active session messages
                state.modeStates[mode].messages.push(assistantMsg);

                // Stamp last successful request
                state.modeStates[mode].lastRequest = {
                    code: state.modeStates[mode].code,
                    mode: mode,
                    model: state.selectedModel,
                };

                // Update history
                if (state.activeHistoryId) {
                    const existing = state.history.find(h => h.id === state.activeHistoryId);
                    if (existing) {
                        existing.messages = [...state.modeStates[mode].messages];
                        existing.timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        existing.repoUrl = state.modeStates[mode].repoUrl;
                        existing.isRepoConnected = state.modeStates[mode].isRepoConnected;
                        // Update preview if it was "Empty input" or similar
                        if (existing.preview === 'Empty input' || existing.preview === 'New Chat') {
                            existing.preview = state.modeStates[mode].code.trim().slice(0, 60) || 'Active session';
                        }
                        return;
                    }
                }

                // If no active session or not found, create a new one
                const newId = uuidv4();
                state.activeHistoryId = newId;
                const preview = state.modeStates[mode].code.trim().slice(0, 60);
                state.history.unshift({
                    id: newId,
                    mode: mode,
                    messages: [...state.modeStates[mode].messages],
                    model: state.selectedModel,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    preview: preview || 'Empty input',
                    repoUrl: state.modeStates[mode].repoUrl,
                    isRepoConnected: state.modeStates[mode].isRepoConnected
                });
            })
            .addCase(analyzeCode.rejected, (state, action) => {
                state.modeStates[state.selectedMode].isLoading = false;
                state.modeStates[state.selectedMode].response = action.payload as string || 'An error occurred. Please try again.';
            })
            // ── Load sessions from Supabase ──
            .addCase(loadUserSessions.pending, (state) => {
                state.sessionsLoaded = false;
            })
            .addCase(loadUserSessions.fulfilled, (state, action) => {
                state.sessionsLoaded = true;
                state.history = action.payload.map(s => ({
                    id: s.id,
                    mode: s.mode as import('@/constants/frontend-constants').FeatureMode,
                    model: s.model as import('@/constants/frontend-constants').ModelId,
                    messages: s.messages,
                    timestamp: s.timestamp,
                    preview: s.preview,
                    repoUrl: s.repoUrl,
                    isRepoConnected: s.isRepoConnected,
                }));
            })
            .addCase(loadUserSessions.rejected, (state) => {
                state.sessionsLoaded = true; // mark as loaded even on failure so we don't retry endlessly
            })
            // ── Delete session from Supabase ──
            .addCase(deleteChatSession.fulfilled, (state, action) => {
                const sessionId = action.payload;
                state.history = state.history.filter(h => h.id !== sessionId);
                if (state.activeHistoryId === sessionId) {
                    state.activeHistoryId = null;
                    state.modeStates[state.selectedMode] = createDefaultModeState();
                }
            });
    },
});

export const {
    addMessage,
    deleteHistorySession,
    newChat,
    selectChat,
    setPendingClarify,
    setTitle,
    setMode,
    setModel,
    setCode,
    setResponse,
    setEditorLanguage,
    setModeLoading,
    cancelModeLoading,
    restoreSession,
    newSession,
    addMessageToHistory,
    setRepoUrl,
    setRepoConnected,
} = chatSlice.actions;

export default chatSlice.reducer;

// Selectors
export const selectChats = (state: { chat: ChatState }) => state.chat.chats;
export const selectCurrentChat = (state: { chat: ChatState }) => {
    const chatId = state.chat.currentChatId;
    return state.chat.chats.find(c => c.id === chatId) || null;
}
export const selectPendingClarify = (state: { chat: ChatState }) => state.chat.pendingClarify;

// IDE selectors
export const selectMode = (state: { chat: ChatState }) => state.chat.selectedMode;
export const selectModel = (state: { chat: ChatState }) => state.chat.selectedModel;
export const selectEditorLanguage = (state: { chat: ChatState }) => state.chat.editorLanguage;
export const selectModeStates = (state: { chat: ChatState }) => state.chat.modeStates;
export const selectHistory = (state: { chat: ChatState }) => state.chat.history;

// Derived selectors for the current mode
export const selectCurrentModeState = (state: { chat: ChatState }): ModeState =>
    state.chat.modeStates[state.chat.selectedMode];
export const selectIsLoading = (state: { chat: ChatState }) =>
    state.chat.modeStates[state.chat.selectedMode].isLoading;
export const selectCode = (state: { chat: ChatState }) =>
    state.chat.modeStates[state.chat.selectedMode].code;
export const selectMessages = (state: { chat: ChatState }) =>
    state.chat.modeStates[state.chat.selectedMode].messages;
export const selectResponseText = (state: { chat: ChatState }) =>
    state.chat.modeStates[state.chat.selectedMode].response;

export const selectRepoUrl = (state: { chat: ChatState }) =>
    state.chat.modeStates[state.chat.selectedMode].repoUrl;
export const selectIsRepoConnected = (state: { chat: ChatState }) =>
    state.chat.modeStates[state.chat.selectedMode].isRepoConnected;

// Check if ANY mode is currently loading
export const selectIsAnyModeLoading = (state: { chat: ChatState }): boolean =>
    Object.values(state.chat.modeStates).some(ms => ms.isLoading);

// Check if the current input has changed since the last successful analysis
export const selectHasInputChanged = (state: { chat: ChatState }): boolean => {
    const mode = state.chat.selectedMode;
    const modeState = state.chat.modeStates[mode];
    const last = modeState.lastRequest;

    // No previous request → input is "changed" (allow first analysis)
    if (!last) return true;

    // Compare current state against last successful request
    return (
        modeState.code !== last.code ||
        mode !== last.mode ||
        state.chat.selectedModel !== last.model
    );
};
