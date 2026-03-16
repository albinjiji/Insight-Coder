'use client';

import React from 'react';
import styles from '../../styles/ide/Header.module.css';
import { modelOptions, ModelId } from '@/constants/frontend-constants';

interface HeaderProps {
    selectedModel: ModelId;
    onModelChange: (model: ModelId) => void;
}

export default function Header({ selectedModel, onModelChange }: HeaderProps) {
    return (
        <header className={styles.header}>
            <div className={styles.headerLeft}>
                <div className={styles.logoMark} />
                <h1 className={styles.headerTitle}>InsightCoder</h1>
                <span className={styles.headerBadge}>AI</span>
            </div>
            <div className={styles.headerRight}>
                <div className={styles.modelSelector}>
                    <select
                        id="model-select"
                        value={selectedModel}
                        onChange={(e) => onModelChange(e.target.value as ModelId)}
                        className={styles.modelDropdown}
                    >
                        {modelOptions.map((model) => (
                            <option key={model.id} value={model.id}>
                                {model.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </header>
    );
}
