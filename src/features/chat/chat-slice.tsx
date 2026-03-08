import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';
import { sendMessage, analyzeCode } from "./chat-thunks";
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
    isLoading: boolean;
    lastRequest: LastRequest | null;
}

function createDefaultModeState(): ModeState {
    return { code: '', response: '', isLoading: false, lastRequest: null };
}

export type ModeStates = Record<FeatureMode, ModeState>;

export interface ChatState {
    chats: ChatSession[];
    currentChatId: string | null;
    pendingClarify: PendingClarify;
    // IDE panel state
    selectedMode: FeatureMode;
    selectedModel: ModelId;
    editorLanguage: EditorLanguage;
    modeStates: ModeStates;
}

const initialState: ChatState = {
    chats: [],
    currentChatId: null,
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
        },
        setModel(state, action: PayloadAction<ModelId>) {
            state.selectedModel = action.payload;
        },
        setEditorLanguage(state, action: PayloadAction<EditorLanguage>) {
            state.editorLanguage = action.payload;
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
                state.modeStates[state.selectedMode].isLoading = true;
                state.modeStates[state.selectedMode].response = '';
            })
            .addCase(analyzeCode.fulfilled, (state, action) => {
                const mode = state.selectedMode;
                state.modeStates[mode].isLoading = false;
                state.modeStates[mode].response = action.payload;
                // Stamp last successful request
                state.modeStates[mode].lastRequest = {
                    code: state.modeStates[mode].code,
                    mode: mode,
                    model: state.selectedModel,
                };
            })
            .addCase(analyzeCode.rejected, (state, action) => {
                state.modeStates[state.selectedMode].isLoading = false;
                state.modeStates[state.selectedMode].response = action.payload as string || 'An error occurred. Please try again.';
            });
    },
});

export const {
    addMessage,
    deleteChat,
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

// Derived selectors for the current mode
export const selectCurrentModeState = (state: { chat: ChatState }): ModeState =>
    state.chat.modeStates[state.chat.selectedMode];
export const selectIsLoading = (state: { chat: ChatState }) =>
    state.chat.modeStates[state.chat.selectedMode].isLoading;
export const selectCode = (state: { chat: ChatState }) =>
    state.chat.modeStates[state.chat.selectedMode].code;
export const selectResponseText = (state: { chat: ChatState }) =>
    state.chat.modeStates[state.chat.selectedMode].response;

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
