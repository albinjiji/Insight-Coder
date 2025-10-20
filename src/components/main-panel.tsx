import React, { useEffect, useRef } from 'react';
import styles from '../styles/components/main-panel.module.css';
import ChatInput from './chat-input';
import { landingPageValues } from '@/constants/frontend-constants';
import ResponseMessage from './response-message';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

interface MainPanelProps {
  onSend: (text: string) => void;
  onNewChat: () => void;
  messages: Message[];
  isLoading: boolean;
}

export default function MainPanel({
  onSend,
  onNewChat,
  messages,
  isLoading,
}: MainPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <main className={styles.mainPanel}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.headerTitle} onClick={onNewChat}>
          {landingPageValues.header}
        </h1>
      </header>

      {/* Message area */}
      <section className={styles.messages} aria-live="polite">

        {messages.length === 0 && (
          <div className={styles.placeholder}>
            <h2>Welcome to InsightCoder</h2>
            <p>Ask me to debug, explain, or generate any piece of code.</p>
          </div>
        )}

        {messages?.map((msg, i) => (
          <ResponseMessage key={i} text={msg.text} role={msg.role} />
        ))}

        {isLoading && (
          <div className={styles.thinking}>
            <span>Analyzing...</span>
            <div className={styles.spinner}></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </section>

      {/* Chat input */}
      <div className={styles.chatInput}>
        <ChatInput onSend={onSend} />
      </div>
    </main>
  );
}
