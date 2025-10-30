import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "../features/chat/chat-slice";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
