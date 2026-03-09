'use client';

import React from 'react';
import styles from '../../styles/ide/RepoPanel.module.css';
import { mainPanelValues } from '@/constants/frontend-constants';

interface RepoPanelProps {
    repoUrl: string;
    onRepoUrlChange: (value: string) => void;
}

export default function RepoPanel({ repoUrl, onRepoUrlChange }: RepoPanelProps) {
    return (
        <div className={styles.panelWrapper}>
            <div className={styles.panelHeader}>
                <div className={styles.panelDot} data-color="red" />
                <div className={styles.panelDot} data-color="yellow" />
                <div className={styles.panelDot} data-color="green" />
                <div className={styles.panelTitle}>Repo Analyzer</div>
            </div>
            <div className={styles.chatContainer}>
                <div className={styles.chatIcon}>📁</div>
                <h2 className={styles.chatHeading}>Analyze Repository</h2>
                <p className={styles.chatSubtext}>
                    Paste the URL of a GitHub repository to analyze its structure and code.
                </p>
                <input
                    type="text"
                    className={styles.repoInput}
                    placeholder={mainPanelValues.repoPlaceholder}
                    value={repoUrl}
                    onChange={(e) => onRepoUrlChange(e.target.value)}
                />
            </div>
        </div>
    );
}
