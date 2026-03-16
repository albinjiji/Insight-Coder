# InsightCoder

**InsightCoder** is an **AI-powered developer assistant with an integrated IDE** designed to help engineers understand, debug, and work with complex codebases.

It provides a modern **multi-mode AI workspace and browser-based IDE** for writing, exploring, and improving code.

[![Next.js](https://img.shields.io/badge/Next.js-14%2B-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)](https://www.typescriptlang.org/)
[![Redux Toolkit](https://img.shields.io/badge/State-Redux%20Toolkit-764abc)](https://redux-toolkit.js.org/)
[![Google Gemini](https://img.shields.io/badge/AI-Gemini-0b57d0)](https://ai.google.dev/)

---

## ✨ Features

### Multi-Mode AI Workspace

---InsightCoder introduces specialized AI modes designed for real developer workflows.

| Mode | Purpose |
|------|---------|
| Chat | General coding discussions |
| Explain | Code understanding |
| Review | AI-assisted code review |
| Debug | Bug diagnosis |
| Test | Unit test generation |
| Repo | Codebase exploration |

Each mode helps developers interact with the AI in a **task-focused workflow**.

---

## 💻 Integrated Browser IDE

InsightCoder includes a **built-in IDE experience inside the browser**.

Developers can:

- Edit code directly inside the application
- Ask AI questions about the current code
- Get explanations for selected code blocks
- Debug issues without leaving the editor
- Generate tests for the current file
- Review code with AI assistance

This makes InsightCoder feel like a **lightweight AI-powered development environment**, not just a chat interface.

---

## 🚀 Core Capabilities

- **Integrated browser IDE**
- **Multi-mode AI assistant**
- **Chat history with auto titles**
- **New Chat**
- **Code-aware responses**
- **Clarification flow for incomplete prompts**
- **Markdown responses with syntax highlighting**
- **Coding query classification**
- **Redux state management**
- **Clean dark UI**

---

## 🖥 Main Panel

The main panel now acts as the **AI workspace and IDE interaction layer**.

Developers can switch between modes to perform specific tasks:

- **Chat Mode** – General coding questions
- **Explain Mode** – Understand complex code
- **Review Mode** – AI-assisted code review
- **Debug Mode** – Diagnose errors and bugs
- **Test Mode** – Generate tests and edge cases
- **Repo Mode** – Ask questions about the entire repository

This helps developers **navigate large codebases faster**.

---

## 🖼 Tech Stack

- **Frontend**: Next.js (App Router), React 18, TypeScript, CSS Modules  
- **State**: Redux Toolkit (slice + async thunk)  
- **AI**: `@google/genai` (Gemini) via a Next.js API route  
- **Markdown**: `react-markdown` + `react-syntax-highlighter` (Prism oneDark)  
- **IDs**: `uuid` (v4)

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

#### Models used

- **gemini-3-flash-preview**
- **gemini-2.5-flash**
- **gemini-2.0-flash**
- **gemini-1.5-flash**
- **gemini-flash-latest**

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
