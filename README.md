# InsightCoder 🚀

**InsightCoder** is a AI-powered developer workspace designed for technical analysis, codebase exploration, and rapid debugging. It combines a multi-mode AI agent with an integrated browser IDE to provide a high-performance environment for modern software development.

---

## ✨ Features

### 🧠 Multi-Mode AI Workspace
InsightCoder offers specialized workflows tailored to developer tasks. Instead of generic chat, switch between targeted modes for high-precision results:

| Mode | Purpose |
|------|---------|
| **Chat** | General technical discussion and rapid prototyping |
| **Explain** | Deep-dive into complex logic and architectural patterns |
| **Review** | Pro-level code quality audits and optimization feedback |
| **Debug** | Root cause analysis and automated bug diagnosis |
| **Tests** | Generation of comprehensive unit tests and edge cases |
| **Repo** | Intelligent code indexing and repository-wide exploration |

### 🛠️ Integrated Browser IDE
A full-featured IDE experience directly in the browser using the **Monaco Editor** (the engine behind VS Code).
- **In-Editor Context**: Ask AI questions about the code you are currently writing.
- **Side-by-Side Analysis**: View code and AI insights simultaneously without switching tabs.
- **Syntax Highlighting**: Support for multiple languages with a premium dark-themed interface.

### 🔄 Persistence & Cloud Sync
Built on **Supabase**, InsightCoder ensures your workspace is exactly how you left it.
- **Cloud History**: Every session is saved and accessible across devices.
- **Session Management**: Easily restore, rename, or delete past analysis sessions.
- **Real-time Sync**: AI responses stream directly to your persistent history.

### 🛡️ Secure Authentication
Full integration with **Supabase Auth** provides a protected environment for your technical data and credentials.

---

## 💻 Tech Stack

- **Frontend**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **UI & Logic**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **AI Backend**: [Google Gemini 2.0](https://ai.google.dev/)
- **Database/Auth**: [Supabase](https://supabase.com/)
- **Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)

---

## 🚀 Getting Started

### 1️⃣ Prerequisites
- **Node.js 18.x** or later
- **Google Gemini API Key** (Get it from [Google AI Studio](https://aistudio.google.com/app/apikey))
- **Supabase Project** (Create one at [supabase.com](https://supabase.com))

### 2️⃣ Installation
```bash
git clone https://github.com/your-username/Insight-Coder.git
cd Insight-Coder
npm i
```

### 3️⃣ Environment Setup
Create a `.env.local` file in the root:
```env
# AI
GEMINI_API_KEY=your_gemini_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4️⃣ Database Initialization
Execute the SQL script found in `supabase/schema.sql` within your Supabase SQL Editor. This sets up the `chat_sessions` and `chat_messages` tables with **Row Level Security (RLS)**.

### 5️⃣ Run the Workspace
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to start coding.

---

## 🛡️ Security & Privacy
InsightCoder prioritizes data isolation. Using **PostgreSQL RLS**, we ensure that your prompts and AI analyses are only viewable by you. No technical data is shared between users.

## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

---
Built with ❤️ by [Albin Jiji](https://github.com/albinjiji)
