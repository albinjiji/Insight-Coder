# Insight-Coder 🚀

**Insight-Coder** is an AI-powered developer workspace designed for technical analysis, code exploration, and rapid debugging. It combines a multi-mode AI agent with an integrated browser IDE to provide a high-performance environment for modern software development.

**Live Demo**: [insight-coder.vercel.app](https://insight-coder.vercel.app)

---

## ✨ Features

### 🧠 Multi-Mode AI Workspace

Switch between 6 specialized AI modes, each optimized for different coding tasks:

| Mode | Purpose |
|------|---------|
| **Chat** | General technical discussion and rapid prototyping |
| **Explain** | Deep-dive into complex logic and architectural patterns |
| **Review** | Code quality audits and optimization feedback |
| **Debug** | Root cause analysis and automated bug diagnosis |
| **Tests** | Generation of comprehensive unit tests and edge cases |
| **Repo** | Intelligent code indexing and repository-wide exploration |

### 🛠️ Integrated Browser IDE

Full-featured IDE experience directly in your browser using **Monaco Editor** (the engine behind VS Code).

- **In-Editor Context**: Ask AI questions about your code while writing
- **Side-by-Side Analysis**: View code and AI insights simultaneously
- **Multi-Language Support**: Syntax highlighting for 30+ programming languages
- **Dark Theme**: Optimized for extended development sessions

### 🔄 Persistence & Cloud Sync

Built on **Supabase**, your workspace is always in sync across devices.

- **Cloud History**: Every session is saved and accessible from anywhere
- **Session Management**: Restore, rename, or delete past sessions
- **Real-time Sync**: AI responses stream directly to your history

### 🛡️ Secure Authentication

Full integration with **Supabase Auth** keeps your technical data safe and secure.

---

## 💻 Tech Stack

- **Frontend**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **UI & Logic**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **AI Engine**: [Google Gemini 2.0](https://ai.google.dev/)
- **Backend**: [Supabase](https://supabase.com/) (PostgreSQL, Auth)
- **Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or later
- **npm** or **yarn**
- **Google Gemini API Key** ([Get it here](https://aistudio.google.com/app/apikey))
- **Supabase Account** ([Create one here](https://supabase.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/albinjiji/Insight-Coder.git
   cd Insight-Coder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Google Gemini API
   GEMINI_API_KEY=your_gemini_api_key

   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Initialize the database**
   
   - Go to your Supabase dashboard
   - Open the SQL Editor
   - Run the schema from `supabase/schema.sql`
   
   This creates:
   - `chat_sessions` table
   - `chat_messages` table
   - Row-level security policies for data isolation

5. **Start the development server**
   ```bash
   npm run dev
   ```
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📦 Build & Deploy

### Development
```bash
npm run dev          # Start dev server with hot reload
npm run lint         # Run ESLint
npm run lint --fix   # Fix linting issues
```

### Production
```bash
npm run build        # Build for production
npm run start        # Run production server
```

### Deploy to Vercel
The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy with one click

---

## 🏗️ Project Structure

```
Insight-Coder/
├── src/
│   ├── app/              # Next.js pages and app routes
│   ├── components/       # React components
│   │   ├── Editor/       # Monaco Editor wrapper
│   │   ├── Chat/         # Chat interface
│   │   └── Layout/       # Layout components
│   ├── store/            # Redux store & slices
│   ├── lib/              # Utility functions
│   │   ├── api/          # API helpers
│   │   ├── auth/         # Authentication
│   │   └── supabase/     # Supabase client
│   └── types/            # TypeScript types
├── supabase/
│   └── schema.sql        # Database schema
├── public/               # Static files
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── README.md
```

---

## 🔐 Security

Insight-Coder prioritizes your data security:

- **Secure Authentication**: OAuth 2.0 with Supabase Auth
- **Data Isolation**: PostgreSQL Row-Level Security (RLS) ensures only you can see your data
- **Encrypted Communication**: All data in transit is encrypted with HTTPS/TLS
- **Server-Side Keys**: API keys are never exposed to the browser

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 🐛 Reporting Issues

Found a bug? Have a feature request? 

[Open an Issue](https://github.com/albinjiji/Insight-Coder/issues) and let us know!

---

## 📝 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- [Google Gemini](https://ai.google.dev/) for powerful AI capabilities
- [Supabase](https://supabase.com/) for backend infrastructure
- [Vercel](https://vercel.com/) for seamless deployment
- [Microsoft Monaco Editor](https://microsoft.github.io/monaco-editor/) for the editor experience

---

## 📞 Support

For questions or support:
- Check the [Issues](https://github.com/albinjiji/Insight-Coder/issues) page
- Visit our [Live Demo](https://insight-coder.vercel.app)

---

Built with ❤️ by [Albin Jiji](https://github.com/albinjiji)
