# InsightCoder

**AI-powered coding assistant** for the browser. InsightCoder helps you write, debug, and learn code with clear explanations, syntax-highlighted snippets, and a chat UX that supports multi-turn **clarifications**.

[![Next.js](https://img.shields.io/badge/Next.js-14+-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)](https://www.typescriptlang.org/)
[![Redux Toolkit](https://img.shields.io/badge/State-Redux%20Toolkit-764abc)](https://redux-toolkit.js.org/)
[![Google Gemini](https://img.shields.io/badge/AI-Gemini-0b57d0)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#license)

---

## ✨ Features

- **Chat UX** with history, auto-titles, delete chat, and “New Chat”
- **Code-aware answers** (Gemini 2.5 Flash with fallback to 1.5 Flash)
- **Classification gate** to filter non-coding queries
- **Clarify flow**: asks for missing context and chains follow-ups
- **Markdown + syntax highlighting** (Prism one-dark)
- **Redux Toolkit** app state (no localStorage)
- **Keyboard**: `Enter` to send, `Shift+Enter` for newline
- **Dark, clean UI** with CSS Modules

---

## 🖼️ Stack

- **Next.js (App Router)**, **React 18**, **TypeScript**
- **Redux Toolkit** (slice + async thunk)
- **Google Gemini** via `@google/genai` (called from a Next.js API route)
- **react-markdown** + **react-syntax-highlighter** (Prism oneDark)
- **uuid** for v4 IDs

---

## 📁 Project Structure

src/
app/
api/
gemini/
route.ts # Server route → calls Google Gemini
home-page/
page.tsx # App shell (Sidebar + MainPanel)
layout.tsx # Wraps Redux Provider
page.tsx # Landing page
components/
chat-input.tsx
main-panel.tsx
response-message.tsx
sidebar.tsx
icons.tsx
features/
chat/
chatSlice.ts # Redux slice (chats, selection, clarify, loading)
chatThunks.ts # sendMessage() async flow
hooks/
redux.ts # typed hooks (useAppDispatch/useAppSelector)
lib/
geminiClient.ts # classify → correct → answer → clarify helpers
styles/
components/.module.css
pages/.module.css
types/
chat.ts # Message / ChatSession types
store.ts # configureStore (adds chat reducer)
