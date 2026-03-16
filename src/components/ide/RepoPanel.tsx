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
    onAction: (prompt?: string, displayText?: string) => void;
    isLoading: boolean;
    isDisabled: boolean;
}

const SUPERPOWERS = [
    {
        id: 'arch',
        label: 'Architecture Overview',
        icon: '🏗️',
        description: 'Understand the high-level system design.',
        prompt: `Analyze this repository and provide a high-level architecture overview.

        Output format:
        1. Project purpose
        2. Main directories and their responsibilities
        3. Core modules/components and how they interact
        4. Entry points (app start, API layer, CLI, workers, etc.)
        5. Architectural patterns used
        6. Notable design decisions or boundaries

        Requirements:
        - Reference specific files/directories for each claim
        - Distinguish confirmed facts from likely assumptions
        - Keep the explanation practical for a developer reading this repo for the first time`
    },
    {
        id: 'flow',
        label: 'Code Flow Tracing',
        icon: '🌊',
        description: 'Trace how data moves through the repo.',
        prompt: `Trace the main code flows in this repository.

        Explain:
        1. How a typical request, command, or user action enters the system
        2. Which files/modules process it step by step
        3. How state, data, or control moves through the code
        4. Where validation, business logic, and persistence happen
        5. Where errors are handled
        6. Important branching points or side effects

        Requirements:
        - Use a step-by-step flow
        - Reference specific files/functions where possible
        - Mention alternative flows if the repo supports more than one execution path`
    },
    {
        id: 'features',
        label: 'Feature Discovery',
        icon: '🔍',
        description: 'Locate where specific features live.',
        prompt: `Identify the major features implemented in this repository.

        For each feature, provide:
        1. Feature name
        2. What it does
        3. Main files/directories involved
        4. Key entry points or functions
        5. Any related tests, configs, or docs

        Requirements:
        - Group related files together
        - Avoid guessing features that are not clearly supported by the code
        - Prefer implementation evidence over high-level assumptions`
    },
    {
        id: 'deps',
        label: 'Dependency Map',
        icon: '🕸️',
        description: 'Visualize module interactions.',
        prompt: `Analyze the dependencies and module relationships in this project.

        Explain:
        1. External libraries/frameworks used and why
        2. Internal module boundaries and coupling
        3. Which modules depend heavily on others
        4. Potential tight coupling, circular dependency risk, or architectural hotspots
        5. Build/runtime/tooling dependencies

        Requirements:
        - Separate external dependencies from internal module relationships
        - Highlight important dependency-heavy files or areas
        - Focus on maintainability and developer understanding`
    },
    {
        id: 'style',
        label: 'Coding Conventions',
        icon: '📜',
        description: 'Learn the project style and rules.',
        prompt: `Identify the coding conventions and engineering patterns followed in this repository.

        Look for:
        1. Naming conventions
        2. File/folder organization patterns
        3. Error handling style
        4. Testing style
        5. State management or data handling conventions
        6. Reusable patterns, abstractions, or architectural rules
        7. Linting/formatting/config-enforced rules if present

        Requirements:
        - Reference actual examples from the codebase
        - Distinguish explicit rules from inferred conventions
        - Summarize what a new contributor should follow`
    },
    {
        id: 'onboard',
        label: 'Onboarding Guide',
        icon: '🚩',
        description: 'Personalized "Where to start" plan.',
        prompt: `Create a practical onboarding guide for a new developer joining this codebase.

        Include:
        1. What this project appears to do
        2. What files/directories to read first
        3. A recommended order for exploring the codebase
        4. Key concepts the developer must understand early
        5. Where the main business logic lives
        6. Where tests, configs, and docs are located
        7. A safe beginner task or small change to start with

        Requirements:
        - Make it actionable and beginner-friendly
        - Reference specific files/directories
        - Mention unknowns or unclear parts of the repo when relevant`
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

    const handleSuperpower = (label: string, prompt: string) => {
        onAction(prompt, label);
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
                                onClick={() => handleSuperpower(power.label, power.prompt)}
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
