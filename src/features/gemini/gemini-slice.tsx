import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const geminiApi = createApi({
  reducerPath: "geminiApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getGeminiResponse: builder.mutation<{ text: string }, { prompt: string }>({
      query: (body) => ({
        url: "/gemini",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetGeminiResponseMutation } = geminiApi;
