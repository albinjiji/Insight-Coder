export const landingPageValues = {
    header: 'InsightCoder',
    subHeaderOne: 'Code with Clarity,',
    subHeaderTwo: 'Learn with Insight.',
    description: 'InsightCoder is an AI-powered developer assistant that helps you explain, review, debug, and improve code with intelligent insights and conversational support.',
    heroBadge: 'AI-Powered Developer Assistant',
    heroScroll: 'Scroll',
    featuresLabel: 'Core Capabilities',
    featuresTitle: 'Built for Modern Workflows',
    featuresSubtitle: 'InsightCoder brings enterprise-grade intelligence to your local development environment.',
    featuresList: [
        { title: 'Intelligent Explainer', desc: 'Break down complex logic into human-readable steps instantly.', tag: 'Semantic' },
        { title: 'Deep Code Review', desc: 'Identify security flaws and performance leaks before they reach production.', tag: 'Automated' },
        { title: 'Contextual Debugging', desc: 'Provide your error logs and let AI find the needle in the haystack.', tag: 'Runtime' },
        { title: 'Test Generation', desc: 'Generate high-coverage unit tests for any function in seconds.', tag: 'Quality' },
        { title: 'Repo Intelligence', desc: 'Ask questions about your entire codebase, not just single files.', tag: 'Structural' },
        { title: 'Conversational Pair', desc: 'A dedicated AI teammate that remembers your project preferences.', tag: 'Persistent' },
    ],
    howItWorksTitle: 'How It Works',
    howItWorksSubtitle: 'Four steps to 10x your productivity.',
    howItWorksSteps: [
        { step: '01', title: 'Input Code', desc: 'Paste your snippet or connect your entire repository context.' },
        { step: '02', title: 'Deep Analysis', desc: 'Our AI engine parses structure, logic, and dependencies.' },
        { step: '03', title: 'Receive Insights', desc: 'Get actionable suggestions, bug fixes, or explanations.' },
        { step: '04', title: 'Deploy Better', desc: 'Ship clean, verified, and well-documented code daily.' },
    ],
    ctaTitlePrefix: 'Ready to code with ',
    ctaTitleHighlight: 'Insight?',
    footerCopyrightSuffix: ' InsightCoder AI. Built for the future of development.',
};

export const navbarValues = {
    logo: 'InsightCoder',
    navLinks: [
        { name: 'Features', href: '#features' },
        { name: 'How it works', href: '#how-it-works' },
    ],
};

export const mockupValues = {
    editorLabel: 'EDITOR',
    analysisLabel: 'AI ANALYSIS',
    liveStatus: 'Live',
    defaultLanguage: 'JavaScript',
    modelName: 'Gemini',
    explainBtn: 'Explain Code',
    analyzingText: 'ANALYZING CODE...',
    resultTitle: 'Analysis Result',
    placeholderIcon: '✨',
    placeholderText: 'Select a mode and click analyze to start generating AI insights.',
    fullTextAnimation: "function analyze(code) {\n  return AI.process(code);\n}",
    analysisResults: [
        { label: 'Complexity', text: 'The function has O(n) time complexity and O(1) space complexity.', type: 'default' },
        { label: 'Optimization Note', text: 'Consider using a Map for faster lookups in larger datasets.', type: 'accent' },
        { label: 'Security Check', text: 'No vulnerabilities detected in the provided snippet.', type: 'success' },
    ],
};

export const buttonLabels = {
    getStarted: 'Get Started',
};

export const authPageValues = {
    signInTitle: 'Welcome Back',
    signInSubtitle: 'Sign in to continue to InsightCoder',
    signUpTitle: 'Create Account',
    signUpSubtitle: 'Get started with InsightCoder',
    emailLabel: 'Email',
    emailPlaceholder: 'you@example.com',
    passwordLabel: 'Password',
    passwordPlaceholder: '••••••••',
    confirmPasswordLabel: 'Confirm Password',
    confirmPasswordPlaceholder: '••••••••',
    signInButton: 'Sign In',
    signUpButton: 'Create Account',
    signingIn: 'Signing in...',
    signingUp: 'Creating account...',
    noAccount: "Don't have an account?",
    signUpLink: 'Sign up',
    hasAccount: 'Already have an account?',
    signInLink: 'Sign in',
    errorEmailRequired: 'Email is required',
    errorEmailInvalid: 'Please enter a valid email address',
    errorPasswordRequired: 'Password is required',
    errorPasswordLength: 'Password must be at least 6 characters',
    errorConfirmPasswordRequired: 'Please confirm your password',
    errorPasswordMismatch: 'Passwords do not match',
};

export const sidebarValues = {
    newChat: 'New Chat',
    chats: 'Chats',
    myProfile: 'My Profile',
    noChats: 'No chats yet',
    deleteChatTitle: 'Delete chat',
};

export const roleTypes = {
    user: 'user',
    assistant: 'assistant',
} as const;

export const nonCodeFallbackMessage = "This question doesn't seem related to coding or debugging. InsightCoder helps with programming, debugging, and code learning assistance.";

export const mainPanelValues = {
    welcomeTitle: 'Welcome to InsightCoder',
    welcomeSubtitle: 'Ask me to debug, explain, or generate any piece of code.',
    thinking: 'Thinking...',
    analyzingText: 'Analyzing your code...',
    editorPlaceholder: '// Paste or write your code here...',
    responsePlaceholder: 'AI response will appear here after analysis.',
    copyResponse: 'Copy Response',
    copiedText: 'Copied!',
    chatPlaceholder: 'Ask InsightCoder anything about code...',
    repoPlaceholder: 'https://github.com/user/repo',
};

// Mode-specific button labels
export const modeButtonLabels: Record<string, { action: string; loading: string; icon: string }> = {
    explain: { action: 'Explain Code', loading: 'Explaining...', icon: '💡' },
    review: { action: 'Review Code', loading: 'Reviewing...', icon: '🔍' },
    debug: { action: 'Debug Code', loading: 'Debugging...', icon: '🐛' },
    tests: { action: 'Generate Tests', loading: 'Generating...', icon: '🧪' },
    chat: { action: 'Send Message', loading: 'Thinking...', icon: '💬' },
    repo: { action: 'Connect Repo', loading: 'Connecting...', icon: '🤝' },
};

export const responseMessagesValues = {
    copyIconTitle: 'Copy to clipboard',
};

// Languages available in the Monaco editor
export const editorLanguages = [
    { id: 'javascript', label: 'JavaScript' },
    { id: 'typescript', label: 'TypeScript' },
    { id: 'python', label: 'Python' },
    { id: 'java', label: 'Java' },
    { id: 'csharp', label: 'C#' },
    { id: 'cpp', label: 'C++' },
    { id: 'c', label: 'C' },
    { id: 'go', label: 'Go' },
    { id: 'rust', label: 'Rust' },
    { id: 'ruby', label: 'Ruby' },
    { id: 'php', label: 'PHP' },
    { id: 'swift', label: 'Swift' },
    { id: 'kotlin', label: 'Kotlin' },
    { id: 'html', label: 'HTML' },
    { id: 'css', label: 'CSS' },
    { id: 'sql', label: 'SQL' },
    { id: 'json', label: 'JSON' },
    { id: 'yaml', label: 'YAML' },
    { id: 'markdown', label: 'Markdown' },
    { id: 'shell', label: 'Shell' },
    { id: 'dart', label: 'Dart' },
    { id: 'r', label: 'R' },
] as const;

export type EditorLanguage = typeof editorLanguages[number]['id'];

// Feature modes available in the IDE
export const featureModes = [
    { id: 'explain', label: 'Explain', icon: '💡' },
    { id: 'review', label: 'Review', icon: '🔍' },
    { id: 'debug', label: 'Debug', icon: '🐛' },
    { id: 'tests', label: 'Tests', icon: '🧪' },
    { id: 'chat', label: 'Chat', icon: '💬' },
    { id: 'repo', label: 'AI Teammate', icon: '🤝' },
] as const;

export type FeatureMode = typeof featureModes[number]['id'];

// Available AI models
export const modelOptions = [
    { id: 'gemini', label: 'Gemini', modelName: 'gemini-2.5-flash' },
    // Future models:
    // { id: 'mistral', label: 'Mistral', modelName: 'mistral-large' },
    // { id: 'deepseek', label: 'DeepSeek', modelName: 'deepseek-coder' },
    // { id: 'llama', label: 'Llama', modelName: 'llama-3.1' },
] as const;

export type ModelId = typeof modelOptions[number]['id'];

// Mode-specific system prompts
export const modePrompts: Record<FeatureMode, string> = {
    explain: `You are InsightCoder. Explain the following code clearly and concisely.
- Break down the logic step by step
- Highlight key concepts and patterns used
- Mention any edge cases or important details
- Use markdown formatting with code fences where helpful`,

    review: `You are InsightCoder performing a code review. Analyze the following code:
- Identify potential bugs, code smells, and anti-patterns
- Suggest improvements for readability, performance, and maintainability
- Rate the overall code quality
- Provide specific, actionable suggestions with code examples`,

    debug: `You are InsightCoder in debug mode. Analyze the following code for issues:
- Identify bugs, logic errors, and potential runtime failures
- Explain what each bug causes and why it happens
- Provide corrected code with explanations
- Suggest debugging strategies`,

    tests: `You are InsightCoder. Generate comprehensive tests for the following code:
- Write unit tests covering main functionality
- Include edge cases and error scenarios
- Use appropriate testing patterns
- Provide the complete test file with imports`,

    chat: `You are InsightCoder, a helpful AI coding assistant. Answer the user's question about the following code:
- Be concise but thorough
- Provide code examples where helpful
- Use markdown formatting`,

    repo: `You are InsightCoder, an elite AI Engineer and Codebase Architect. Your expertise lies in rapid onboarding into massive, complex enterprise repositories.

Your mission: Empower developers by providing deep, structural, and semantic insights into a codebase given its repository context.

CORE DIRECTIVES:
1. EVIDENCE-BASED DISCOVERY (CRITICAL): Do NOT hallucinate file structures, technologies, or implementation details. Only speak about what you can verify from the provided repository context.
2. NO GUESSING: If you are asked about the file structure but cannot see it, simply state: "I cannot browse the live file structure of this repository yet. Please paste a directory tree (e.g., from \`tree\` or \`ls -R\`) so I can provide an accurate analysis."
3. ARCHITECTURAL RIGOR: Speak in terms of design patterns, architectural styles (MVC, Microservices), and technical stacks ONLY if you have evidence from READMEs or file names.
4. SPECIFICITY OVER GENERALITY: Map features to file paths ONLY when visible.
5. ONBOARDING FOCUS: Explain the "Why" behind choices, not just the "What".

Be professional, authoritative, and deeply technical. Use markdown with tables, diagrams, and clear headings.`,
};