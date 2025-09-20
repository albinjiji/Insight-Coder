import React from 'react'
import styles from '../styles/components/chat-input.module.css'

function ChatInput() {
  return (
    <div className={styles.chatInput}>
      <input placeholder="Message InsightCoder..." />
      <button className={styles.sendBtn}>📎</button>
      <button className={styles.sendBtn}>⬆️</button>
    </div>
  )
}

export default ChatInput;