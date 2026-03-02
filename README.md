# InsightCoder

**AI-powered coding assistant** for the browser. InsightCoder helps you write, debug, and learn code with clear explanations, syntax-highlighted snippets, and a chat UX that supports multi-turn **clarifications**.

[![Next.js](https://img.shields.io/badge/Next.js-14%2B-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)](https://www.typescriptlang.org/)
[![Redux Toolkit](https://img.shields.io/badge/State-Redux%20Toolkit-764abc)](https://redux-toolkit.js.org/)
[![Google Gemini](https://img.shields.io/badge/AI-Gemini-0b57d0)](https://ai.google.dev/)

---

## ✨ Features

- **Chat UX** with history, auto-titles, delete chat, and “New Chat”
- **Code-aware answers** (Gemini 3 Flash Preview with fallback to 1.5 Flash)
- **Classification gate** (filters non-coding queries with a friendly message)
- **Clarify flow**: asks for missing context; supports chained clarifications
- **Markdown + syntax highlighting** (react-markdown + Prism oneDark)
- **Redux Toolkit** state
- **Dark, clean UI** with CSS Modules

---

## 🖼 Tech Stack

- **Frontend**: Next.js (App Router), React 18, TypeScript, CSS Modules  
- **State**: Redux Toolkit (slice + async thunk)  
- **AI**: `@google/genai` (Gemini) via a Next.js API route  
- **Markdown**: `react-markdown` + `react-syntax-highlighter` (Prism oneDark)  
- **IDs**: `uuid` (v4)

---

## 📁 Project Structure

```text
.
├─ .env.local                  # GEMINI_API_KEY lives here (not committed)
├─ package.json
├─ tsconfig.json
├─ next.config.ts
├─ postcss.config.mjs
├─ tailwind.config.ts          # if you use Tailwind (otherwise omit)
├─ README.md
├─ LICENSE
└─ src/
   ├─ app/
   │  ├─ api/
   │  │  └─ gemini/
   │  │     └─ route.ts        # Next.js API route → calls Google Gemini
   │  ├─ home-page/
   │  │  └─ page.tsx           # App shell (Sidebar + MainPanel)
   │  ├─ layout.tsx            # Wraps Redux Provider
   │  └─ page.tsx              # Landing page
   │
   ├─ components/
   │  ├─ chat-input.tsx
   │  ├─ main-panel.tsx
   │  ├─ response-message.tsx
   │  ├─ sidebar.tsx
   │  └─ icons.tsx
   │
   ├─ constants/
   │  ├─ frontend-constants.tsx
   │
   ├─ features/
   │  └─ chat/
   │     ├─ chat-slice.ts       # Redux slice (chats, selection, clarify, loading)
   │     └─ chat-thunks.ts      # sendMessage() async flow
   │
   ├─ lib/
   │  └─ gemini-client.ts       # classify → correct → answer → clarify helpers
   │
   ├─ styles/
   │  ├─ components/           # *.module.css for components
   │  │  ├─ chat-input.module.css
   │  │  ├─ main-panel.module.css
   │  │  ├─ response-message.module.css
   │  │  └─ sidebar.module.css
   │  └─ pages/                # *.module.css for pages
   │     ├─ home-page.module.css
   │     └─ landing-page.module.css
   │
   └─ store.ts                 # configureStore (adds chat reducer)
```

---

## 1️⃣ Requirements

- **Node.js 18+**
- **A Google Gemini API key** (get it from [Google AI Studio](https://aistudio.google.com/app/apikey))

---

## 2️⃣ Install

```bash
npm i
# or: yarn / pnpm
```

---

## 3️⃣ Environment Setup

Create a `.env.local` file in the project root:

```
GEMINI_API_KEY=your_api_key_here
```

> The key is only read server-side by the Next.js API route.

---

## 4️⃣ Run in Development

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 API Route (Gemini)

The API endpoint at:  
`src/app/api/gemini/route.ts`  
accepts POST requests with:

```json
{ "prompt": "your text", "model": "gemini-3-flash-preview | gemini-1.5-flash" }
```

and returns:

```json
{ "text": "model response", "modelUsed": "gemini-3-flash-preview" }
```

- The route normalizes SDK responses and **retries/falls back** if a model is UNAVAILABLE / 503.

#### Models used

- **gemini-3-flash-preview** (primary generation)
- **gemini-1.5-flash** (classification, typo-correction, fallback generation)

---

## 🧠 Chat Flow (Send button)

Implemented across `chatThunks.ts` and `lib/geminiClient.ts`:

- **Optimistic UI** – your message appears immediately.
- **Clarify mode** (if last assistant message starts with `Clarify:`):

  - Combine the original question + clarify question + your short reply
  - Ask again → chain clarifications if needed; otherwise show final answer

- **Normal mode**:
  - Classify (is it coding-related?) → if not, show a friendly non-code message
  - Correct typos for technical terms
  - Answer (3 → 1.5 with retries/fallback)
  - If weak/ambiguous, return a single `Clarify:` line

---

## 🧭 Redux State

- `chats: ChatSession[]`
- `currentChatId: string | null`
- `isLoading: boolean`
- `pendingClarify: { basePrompt: string; question: string } | null`

**Reducers**

- `newChat()` — create & select a fresh chat
- `selectChat(id)` — switch active chat
- `addMessage({ chatId, message })` — append messages
- `setTitle({ chatId, title })` — auto/rename chat title
- `setPendingClarify(ctx | null)` — store/clear clarify context
- `deleteChat(id) / deleteAllChats()` — remove chats

**Thunk**

- `sendMessage({ prompt })` — runs the full sequence above

---

## 🧩 UI Components

- **Sidebar** — chat list (uniform tiles), “New Chat”, delete chat
- **MainPanel** — header, scrollable messages (auto-scroll), spinner, input dock
- **ChatInput** — autosizing textarea; Enter / Shift+Enter
- **ResponseMessage** — Markdown + inline/fenced code with Prism oneDark

---

## 🛡 Security

- **Keep `GEMINI_API_KEY` in `.env.local` (server-side only).**
- Avoid logging sensitive prompts/responses in production.

---

## 🧪 Troubleshooting

- **“Could not load the default credentials”**  
  Ensure `GEMINI_API_KEY` is set; restart the dev server.

- **503 / UNAVAILABLE**  
  The route already retries and falls back; try again shortly.

- **Type issues with react-syntax-highlighter**  
  Use ESM Prism imports as in `response-message.tsx`:
  ```ts
  import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
  import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
  ```

---

## 📦 Scripts

- `npm run dev`     – start dev server
- `npm run build`   – production build
- `npm run start`   – start prod server
- `npm run lint`    – lint

---

Enjoy chatting! ✨
