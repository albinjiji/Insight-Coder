import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}', // only include if you're using Pages Router
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-geist-mono)', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: '#171717',
        secondary: '#ffffff',
        accent: '#ec4899',
        buttonBackground: '#182f5e',
        borderColor: '#444',
        textFieldPlaceholderColor: '#9aa0a6',
        textFieldBackground: '#151515',
        textFieldBorderColor: '#2a2a2a',
        mainPanelPlaceholderColor: '#9ca3af',
        userBubbleBackgroundColor: '#0d1325',
        sidebarBackgroundColor: '#1e1e1e',
        buttonHoverBackgroundColor: '#2d2d2d',
        sidebarSubHeaderColor: '#a09c9c',
        chatItemHoverColor: '#101214',
        blackColor: '#000',
      },
    },
  },
  plugins: [],
};

export default config;
