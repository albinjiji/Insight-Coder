'use client';

import React from 'react';
import styles from '../../styles/ide/ActionBar.module.css';

interface ActionBarProps {
    isLoading: boolean;
    isDisabled: boolean;
    onAnalyze: () => void;
    buttonLabel: string;
    loadingLabel: string;
    icon: string | React.ReactNode;
}

export default function ActionBar({
    isLoading,
    isDisabled,
    onAnalyze,
    buttonLabel,
    loadingLabel,
    icon,
}: ActionBarProps) {
    return (
        <div className={styles.actionBar}>
            <button
                className={`${styles.analyzeBtn} ${isLoading ? styles.analyzeBtnLoading : ''}`}
                onClick={onAnalyze}
                disabled={isDisabled}
            >
                {isLoading ? (
                    <>
                        <div className={styles.btnSpinner} />
                        <span>{loadingLabel}</span>
                    </>
                ) : (
                    <>
                        <span className={styles.btnIcon}>{icon}</span>
                        <span>{buttonLabel}</span>
                    </>
                )}
            </button>
        </div>
    );
}
