'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/components/main-panel.module.css';
import ChatInput from './chat-input';
import { landingPageValues } from '@/constants/frontend-constants';

export default function MainPanel() {
  const router = useRouter();

  const handleNewChat = () => {
    router.push('/home-page');
  };

  return (
    <main className={styles.mainPanel}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle} onClick={handleNewChat}>
          {landingPageValues.header}
        </h1>
      </header>
      <section className={styles.messages} aria-live="polite">
        {/* render your messages here */}
      </section>
      <div className={styles.chatInput}>
        <ChatInput />
      </div>
    </main>
  );
}