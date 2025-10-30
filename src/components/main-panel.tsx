import React, { useEffect, useRef } from 'react';
import styles from '../styles/components/main-panel.module.css';
import ChatInput from './chat-input';
import { landingPageValues, mainPanelValues } from '@/constants/frontend-constants';
import ResponseMessage from './response-message';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

interface MainPanelProps {
  isLoading: boolean;
  messages: Message[];
  onSend: (text: string) => void;
}

export default function MainPanel({
  isLoading,
  messages,
  onSend,
}: MainPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <main className={styles.mainPanel}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>
          {landingPageValues.header}
        </h1>
      </header>

      {/* Message area */}
      <section className={styles.messages} aria-live="polite">

        {messages.length === 0 && (
          <div className={styles.placeholder}>
            <h2>{mainPanelValues.welcomeTitle}</h2>
            <p>{mainPanelValues.welcomeSubtitle}</p>
          </div>
        )}

        {messages?.map((msg, i) => (
          <ResponseMessage key={i} text={msg.text} role={msg.role} />
        ))}

        {isLoading && (
          <div className={styles.thinking}>
            <span>{mainPanelValues.thinking}</span>
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
