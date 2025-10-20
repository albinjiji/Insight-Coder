'use client';

import React, { ComponentPropsWithoutRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../styles/components/response-message.module.css';
import { CopyIcon } from './icons';

interface ResponseMessageProps {
  text: string;
  role?: 'user' | 'assistant';
}

type CodeProps = ComponentPropsWithoutRef<'code'> & {
  inline?: boolean;
};

export default function ResponseMessage({
  text,
  role = 'assistant',
}: ResponseMessageProps) {
  const isUser = role === 'user';

  return (
    <div
      className={`${styles.messageWrapper} ${
        isUser ? styles.userMessage : styles.assistantMessage
      }`}
    >
      <div
        className={`${styles.messageBubble} ${
          isUser ? styles.userBubble : styles.assistantBubble
        }`}
      >
        {isUser ? (
          // User message: plain text only (no markdown)
          <p className={styles.userPlainText}>{text}</p>
        ) : (
          <ReactMarkdown
            components={{
              code({ inline, className, children, ...props }: CodeProps) {
                const match = /language-(\w+)/.exec(className || '');
                if (!inline && match) {
                  return (
                    <div className={styles.codeBlockWrapper}>
                      <SyntaxHighlighter
                        style={oneDark as any}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{
                          borderRadius: '0.5rem',
                          padding: '1rem',
                          background: '#07090f',
                          fontSize: '0.9rem',
                          overflowX: 'auto',
                        }}
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                      <button
                        className={styles.copyButton}
                        onClick={() =>
                          navigator.clipboard.writeText(String(children))
                        }
                        title="Copy code to clipboard"
                      >
                        <CopyIcon />
                      </button>
                    </div>
                  );
                }

                return (
                  <code
                    className={`${
                      isUser
                        ? styles.userInlineCode
                        : styles.assistantInlineCode
                    }`}
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
            }}
          >
            {text}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
