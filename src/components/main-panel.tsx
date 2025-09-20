import React from 'react'
import ChatInput from './chat-input'
import styles from '../styles/components/main-panel.module.css'

function MainPanel() {
  return (
    <div className={styles.mainPanel}>
      <div className={styles.welcome}>
        <h1>Hi, I&apos;m InsightCoder.</h1>
        <p>How can I assist you with your code?</p>
      </div>
      <ChatInput />
    </div>
  )
}

export default MainPanel