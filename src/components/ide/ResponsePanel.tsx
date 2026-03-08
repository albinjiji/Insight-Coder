'use client';

import React, { useState, ComponentPropsWithoutRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../../styles/ide/ResponsePanel.module.css';
import { CopyIcon } from '../Icons';

interface ResponsePanelProps {
    isLoading: boolean;
    response: string;
    onCopyResponse: () => void;
    copied: boolean;
}

type CodeProps = ComponentPropsWithoutRef<'code'> & {
    inline?: boolean;
};

export default function ResponsePanel({
    isLoading,
    response,
    onCopyResponse,
    copied,
}: ResponsePanelProps) {
    const [localCopiedCode, setLocalCopiedCode] = useState<string | null>(null);

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setLocalCopiedCode(code);
        setTimeout(() => setLocalCopiedCode(null), 2000);
    };

    const CodeComponent = ({ inline, className, children, ...props }: CodeProps) => {
        const match = /language-(\w+)/.exec(className || '');
        const codeContent = String(children).replace(/\n$/, '');

        if (!inline && match) {
            return (
                <div className={styles.codeBlockWrapper}>
                    <div className={styles.codeBlockHeader}>
                        <span className={styles.langBadge}>{match[1]}</span>
                        <button
                            className={styles.codeBlockCopy}
                            onClick={() => handleCopyCode(codeContent)}
                            title="Copy code"
                        >
                            <CopyIcon style={{ width: 14, height: 14 }} />
                            <span style={{ marginLeft: 4 }}>
                                {localCopiedCode === codeContent ? 'Copied!' : 'Copy'}
                            </span>
                        </button>
                    </div>
                    <SyntaxHighlighter
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        style={oneDark as any}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{
                            margin: 0,
                            borderRadius: '0',
                            fontSize: '0.85rem',
                            background: 'transparent',
                            padding: '16px',
                        }}
                        {...props}
                    >
                        {codeContent}
                    </SyntaxHighlighter>
                </div>
            );
        }
        return (
            <code className={styles.inlineCode} {...props}>
                {children}
            </code>
        );
    };

    return (
        <div className={styles.responsePanel}>
            <div className={styles.panelHeader}>
                <div className={styles.panelDot} data-color="red" />
                <div className={styles.panelDot} data-color="yellow" />
                <div className={styles.panelDot} data-color="green" />
                <div className={styles.panelTitle}>AI Analysis</div>
                {response && (
                    <button className={styles.copyBtn} onClick={onCopyResponse}>
                        <CopyIcon />
                        <span>{copied ? 'Copied Full Output!' : 'Copy All'}</span>
                    </button>
                )}
            </div>

            <div className={styles.responseContainer}>
                {isLoading && !response ? (
                    <div className={styles.loadingState}>
                        <div className={styles.loadingPulse} />
                        <span className={styles.loadingText}>Analyzing code architecture...</span>
                    </div>
                ) : response ? (
                    <div className={styles.responseContent}>
                        <ReactMarkdown components={{ code: CodeComponent }}>
                            {response}
                        </ReactMarkdown>
                        {isLoading && (
                            <div className={styles.streamingIndicator}>
                                <div className={styles.streamingBar} />
                                <span>AI is thinking...</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={styles.responsePlaceholder}>
                        <div className={styles.placeholderIcon}>✨</div>
                        <p>Select a mode and click analyze to start generating AI insights.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
