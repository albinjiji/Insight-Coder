'use client';

import React from 'react';
import styles from '../../styles/ide/EditorPanel.module.css';
import { editorLanguages, EditorLanguage } from '@/constants/frontend-constants';

interface EditorPanelProps {
    editorLanguage: EditorLanguage;
    code: string;
    onCodeChange: (code: string) => void;
    onLanguageChange: (lang: EditorLanguage) => void;
    mounted: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    MonacoEditor: any;
}

export default function EditorPanel({
    editorLanguage,
    code,
    onCodeChange,
    onLanguageChange,
    mounted,
    MonacoEditor,
}: EditorPanelProps) {
    return (
        <div className={styles.editorPanel}>
            <div className={styles.panelHeader}>
                <div className={styles.panelDot} data-color="red" />
                <div className={styles.panelDot} data-color="yellow" />
                <div className={styles.panelDot} data-color="green" />
                <div className={styles.panelTitle}>Editor</div>
                <select
                    value={editorLanguage}
                    onChange={(e) => onLanguageChange(e.target.value as EditorLanguage)}
                    className={styles.langDropdown}
                >
                    {editorLanguages.map((lang) => (
                        <option key={lang.id} value={lang.id}>
                            {lang.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className={styles.editorContainer}>
                {mounted && MonacoEditor ? (
                    <MonacoEditor
                        height="100%"
                        language={editorLanguage}
                        theme="vs-dark"
                        value={code}
                        onChange={(value: string | undefined) => onCodeChange(value || '')}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            fontFamily: "'Geist Mono', 'Fira Code', 'Consolas', monospace",
                            lineNumbers: 'on',
                            roundedSelection: true,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            padding: { top: 16, bottom: 16 },
                            fixedOverflowWidgets: true,
                        }}
                    />
                ) : (
                    <div className={styles.editorLoading}>
                        <div className={styles.editorLoadingSpinner} />
                        <span>Loading editor...</span>
                    </div>
                )}
            </div>
        </div>
    );
}
