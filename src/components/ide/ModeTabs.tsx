'use client';

import React from 'react';
import styles from '../../styles/ide/ModeTabs.module.css';
import { featureModes, FeatureMode } from '@/constants/frontend-constants';

interface ModeTabsProps {
    selectedMode: FeatureMode;
    onModeTabClick: (mode: FeatureMode) => void;
}

export default function ModeTabs({ selectedMode, onModeTabClick }: ModeTabsProps) {
    return (
        <nav className={styles.modeTabs}>
            {featureModes.map((mode) => (
                <button
                    key={mode.id}
                    className={`${styles.modeTab} ${selectedMode === mode.id ? styles.modeTabActive : ''}`}
                    onClick={() => onModeTabClick(mode.id)}
                    title={mode.label}
                >
                    <span className={styles.modeIcon}>{mode.icon}</span>
                    <span className={styles.modeLabel}>{mode.label}</span>
                </button>
            ))}
        </nav>
    );
}
