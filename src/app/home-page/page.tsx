'use client';
import React from 'react'
import MainPanel from '@/components/main-panel';
import Sidebar from '@/components/sidebar'
import styles from '../../styles/pages/home-page.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { deleteChat, newChat, selectChat, selectChats, selectCurrentChat, selectIsLoading } from '@/features/chat/chat-slice';
import { sendMessage } from '@/features/chat/chat-thunks';

function HomePage() {
  const dispatch = useDispatch();
  const chats = useSelector(selectChats);
  const currentChat = useSelector(selectCurrentChat);
  const isLoading = useSelector(selectIsLoading);

  const handleNewChat = () => {
    dispatch(newChat());
  };

  const handleSelectChat = (id: string) => {
    dispatch(selectChat(id));
  };

  const handleSend = (prompt: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(sendMessage({ prompt }) as any);
  };

  const handleDeleteChat = (id: string) => {
    dispatch(deleteChat(id));
  }

  return (
    <div className={styles.app}>
      <Sidebar
        chats={chats.map(c => ({
          id: c.id,
          title: c.title || 'New Chat',
        }))}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        activeChatId={currentChat?.id}
        onDeleteChat={handleDeleteChat}
      />
      <MainPanel
        onSend={handleSend}
        messages={currentChat?.messages || []}
        isLoading={isLoading}
      />
    </div>
  )
}

export default HomePage