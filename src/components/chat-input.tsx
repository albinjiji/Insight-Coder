'use client';
import React, { useRef, useState } from 'react';
import styles from '../styles/components/chat-input.module.css';
import { PlusIcon, SendIcon } from './icons';

export default function ChatInput({ onSend }: { onSend?: (text: string) => void }) {
  const [value, setValue] = useState('');
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  const autosize = () => {
    const ta = taRef.current;
    if (!ta) return;
    const line = 22;          // must match CSS line-height
    const maxRows = 6;        // cap growth
    ta.style.height = 'auto';
    const maxH = line * maxRows;
    const newH = Math.min(ta.scrollHeight, maxH);
    ta.style.height = `${newH}px`;
    ta.style.overflowY = ta.scrollHeight > newH ? 'auto' : 'hidden';
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    requestAnimationFrame(autosize);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    // Enter sends, Shift+Enter makes a new line
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const send = () => {
    const text = value.trim();
    if (!text) return;
    onSend?.(text);
    setValue('');
    requestAnimationFrame(autosize);
  };

  console.log('value', value);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send();
  };

  return (
    <form className={styles.dock} onSubmit={onSubmit}>
      <div className={styles.composer}>
        {/* Row 1: textarea */}
        <div className={styles.editor}>
          <textarea
            ref={taRef}
            className={styles.textarea}
            placeholder="Ask InsightCoder…"
            rows={1}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            aria-label="Message input"
          />
        </div>

        {/* Row 2: buttons bar */}
        <button
          type="button"
          className={styles.leftAddon}
          aria-label="Add"
          title="Add"
        >
          <PlusIcon />
        </button>

        <button
          type="submit"
          className={styles.sendBtn}
          aria-label="Send"
          title="Send"
          disabled={!value.trim()}
        >
          <SendIcon />
        </button>
      </div>
    </form>

  );
}
