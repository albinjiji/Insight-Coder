import React, { useState } from 'react';
import styles from '../../styles/ide/RepoPanel.module.css';
import { mainPanelValues } from '@/constants/frontend-constants';

interface RepoPanelProps {
    repoUrl: string;
    onRepoUrlChange: (value: string) => void;
    isRepoConnected: boolean;
    onRepoConnectedChange: (value: boolean) => void;
    repoChatInput: string;
    onRepoChatInputChange: (value: string) => void;
    onAction: (customAction?: string) => void;
    isLoading: boolean;
    isDisabled: boolean;
}

const SUPERPOWERS = [
    { 
        id: 'arch', 
        label: 'Architecture Overview', 
        icon: '🏗️', 
        description: 'Understand the high-level system design.',
        prompt: 'Provide a clear, high-level architecture overview of this repository. Explain the project structure, main directories, and the role of each major module.'
    },
    { 
        id: 'flow', 
        label: 'Code Flow Tracing', 
        icon: '🌊', 
        description: 'Trace how data moves through the repo.',
        prompt: 'Trace the key data flow and logic paths in this repository. Explain how a typical request or state change moves through the system.'
    },
    { 
        id: 'features', 
        label: 'Feature Discovery', 
        icon: '🔍', 
        description: 'Locate where specific features live.',
        prompt: 'Identify the main features of this repository and point to the specific files or directories where they are implemented.'
    },
    { 
        id: 'deps', 
        label: 'Dependency Map', 
        icon: '🕸️', 
        description: 'Visualize module interactions.',
        prompt: 'Analyze the technical dependencies used in this project. Explain their roles and how the internal modules are coupled.'
    },
    { 
        id: 'style', 
        label: 'Coding Conventions', 
        icon: '📜', 
        description: 'Learn the project style and rules.',
        prompt: 'Identify and surface the important coding conventions, patterns, and style rules followed in this repository.'
    },
    { 
        id: 'onboard', 
        label: 'Onboarding Guide', 
        icon: '🚩', 
        description: 'Personalized "Where to start" plan.',
        prompt: 'Create a "Where to Start" guide for a new developer onboarding into this codebase. Suggest a logical order to explore the files and a simple task to get started.'
    },
];

export default function RepoPanel({
    repoUrl,
    onRepoUrlChange,
    isRepoConnected,
    onRepoConnectedChange,
    repoChatInput,
    onRepoChatInputChange,
    onAction,
    isLoading,
    isDisabled
}: RepoPanelProps) {

    const handleConnect = () => {
        if (!repoUrl.trim()) return;
        onRepoConnectedChange(true);
        onAction(); // Trigger initial connection branch in MainPanel
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!isRepoConnected) {
                handleConnect();
            } else if (repoChatInput.trim()) {
                onAction(); // Uses repoChatInput from MainPanel
            }
        }
    };

    const handleSuperpower = (prompt: string) => {
        onAction(prompt);
    };

    return (
        <div className={styles.panelWrapper}>
            <div className={styles.panelHeader}>
                <div className={styles.panelDot} data-color="red" />
                <div className={styles.panelDot} data-color="yellow" />
                <div className={styles.panelDot} data-color="green" />
                <div className={styles.panelTitle}>AI Teammate</div>
            </div>

            {!isRepoConnected ? (
                <div className={styles.chatContainer}>
                    <div className={styles.chatIcon}>🤝</div>
                    <h2 className={styles.chatHeading}>Connect AI Teammate</h2>
                    <p className={styles.chatSubtext}>
                        Paste a GitHub repo URL to onboard your AI teammate into the codebase.
                    </p>
                    <div style={{ width: '100%', maxWidth: '460px', display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            className={styles.repoInput}
                            placeholder={mainPanelValues.repoPlaceholder}
                            value={repoUrl}
                            onChange={(e) => onRepoUrlChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            style={{ flex: 1 }}
                            disabled={isLoading}
                        />
                        <button
                            className={styles.card}
                            style={{ padding: '8px 16px', margin: 0, justifyContent: 'center' }}
                            onClick={handleConnect}
                            disabled={!repoUrl.trim() || isLoading}
                        >
                            Connect
                        </button>
                    </div>
                </div>
            ) : (
                <div className={styles.dashboard}>
                    <div className={styles.dashboardHeader}>
                        <h2>Repository Dashboard</h2>
                        <p>Currently connected to: {repoUrl}</p>
                    </div>

                    <div className={styles.superpowerGrid}>
                        {SUPERPOWERS.map((power) => (
                            <button
                                key={power.id}
                                className={styles.card}
                                onClick={() => handleSuperpower(power.prompt)}
                                disabled={isLoading}
                            >
                                <div className={styles.cardIcon}>{power.icon}</div>
                                <div className={styles.cardTitle}>{power.label}</div>
                                <div className={styles.cardDescription}>{power.description}</div>
                            </button>
                        ))}
                    </div>

                    <div className={styles.repoChatSection}>
                        <label className={styles.repoChatLabel}>Ask anything about the repo</label>
                        <div className={styles.repoChatInputWrapper} style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="text"
                                className={styles.repoChatInput}
                                placeholder="Where is the authentication logic?"
                                value={repoChatInput}
                                onChange={(e) => onRepoChatInputChange(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading}
                                style={{ flex: 1 }}
                            />
                            <button
                                className={styles.card}
                                style={{ padding: '8px 16px', margin: 0, justifyContent: 'center' }}
                                onClick={() => onAction()}
                                disabled={!repoChatInput.trim() || isLoading}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
