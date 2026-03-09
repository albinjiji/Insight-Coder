'use client';

import React from 'react';
import styles from '../../styles/ide/ChatPanel.module.css';
import { mainPanelValues } from '@/constants/frontend-constants';

interface ChatPanelProps {
    chatInput: string;
    onChatInputChange: (value: string) => void;
}

export default function ChatPanel({ chatInput, onChatInputChange }: ChatPanelProps) {
    return (
        <div className={styles.panelWrapper}>
            <div className={styles.panelHeader}>
                <div className={styles.panelDot} data-color="red" />
                <div className={styles.panelDot} data-color="yellow" />
                <div className={styles.panelDot} data-color="green" />
                <div className={styles.panelTitle}>AI Chat</div>
            </div>
            <div className={styles.chatContainer}>
                <div className={styles.chatIcon}>💬</div>
                <h2 className={styles.chatHeading}>Personal AI Assistant</h2>
                <p className={styles.chatSubtext}>
                    Ask anything about code, architecture, or debugging.
                </p>
                <textarea
                    className={styles.chatTextarea}
                    placeholder={mainPanelValues.chatPlaceholder}
                    value={chatInput}
                    onChange={(e) => onChatInputChange(e.target.value)}
                />
            </div>
        </div>
    );
}
