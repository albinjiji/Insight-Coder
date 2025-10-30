import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';
import { sendMessage } from "./chat-thunks";

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

export interface ChatState {
  chats: ChatSession[];
  currentChatId: string | null;
  isLoading: boolean;
  pendingClarify: PendingClarify;
}

const initialState: ChatState = {
  chats: [],
  currentChatId: null,
  isLoading: false,
  pendingClarify: null,
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
        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        deleteChat(state, action: PayloadAction<string>) {
            const chatId = action.payload;
            state.chats = state.chats.filter(c => c.id !== chatId);
            if (state.currentChatId === chatId) {
                state.currentChatId = state.chats.length > 0 ? state.chats[0].id : null;
                state.pendingClarify = null;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendMessage.pending, state => {
                state.isLoading = true;
            })
            .addCase(sendMessage.fulfilled, state => {
                state.isLoading = false;
            })
            .addCase(sendMessage.rejected, state => {
                state.isLoading = false;
            });
    },
});

export const {
  addMessage,
  deleteChat,
  newChat,
  selectChat,
  setLoading,
  setPendingClarify,
  setTitle,
} = chatSlice.actions;

export default chatSlice.reducer;

// Selectors
export const selectChats = (state: { chat: ChatState }) => state.chat.chats;
export const selectCurrentChat = (state: { chat: ChatState }) => {
    const chatId = state.chat.currentChatId;
    return state.chat.chats.find(c => c.id === chatId) || null;
}
export const selectIsLoading = (state: { chat: ChatState }) => state.chat.isLoading;
export const selectPendingClarify = (state: { chat: ChatState }) => state.chat.pendingClarify;
