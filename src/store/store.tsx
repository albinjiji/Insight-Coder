import { configureStore } from "@reduxjs/toolkit";
import { geminiApi } from "@/features/gemini/gemini-slice";

export const store = configureStore({
  reducer: {
    [geminiApi.reducerPath]: geminiApi.reducer,
  },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(geminiApi.middleware),
});
