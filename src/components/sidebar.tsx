'use client';
import React, { useState } from 'react'
import styles from '../styles/components/sidebar.module.css'
import { CloseIcon, DeleteIcon, MenuIcon, PlusIcon, ProfileIcon } from './icons'
import { sidebarValues } from '@/constants/frontend-constants'

interface SidebarProps {
  activeChatId?: string;
  chats: { id: string; title: string }[];
  onDeleteChat?: (id: string) => void;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
}

function Sidebar({
  activeChatId,
  chats,
  onDeleteChat,
  onNewChat,
  onSelectChat,
}: SidebarProps) {

  const [menuOpen, setMenuOpen] = useState(true);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
    if (onDeleteChat) {
      e.stopPropagation(); // prevent selecting the chat when deleting
      onDeleteChat(id);
    }
  };

  return (
    <div className={`${styles.sidebar} ${menuOpen ? styles.open : styles.closed}`}>
      <div className={styles.header}>
        <div className={styles.logo} onClick={toggleMenu} title={menuOpen ? "Close sidebar" : "Open sidebar"}>
          <MenuIcon />
        </div>
        <button
          className={styles.closeButton}
          onClick={toggleMenu}
          title={"Close sidebar"}>
          {menuOpen && <CloseIcon />}
        </button>
      </div>
      <div className={styles.menu}>
        <button className={styles.newReview} onClick={onNewChat} title={sidebarValues.newChat}>
          <PlusIcon />
          {menuOpen && <label className={styles.label}>{sidebarValues.newChat}</label>}
        </button>

        {menuOpen && <div className={styles.history}>
          {menuOpen && <h4>{sidebarValues.chats}</h4>}
        <div className={styles.chatList}>
        {chats.length === 0 ? (
          <p className={styles.empty}>{sidebarValues.noChats}</p>
        ) : (
          chats.map(chat => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`${styles.chatItem} ${chat.id === activeChatId ? styles.active : ''}`}
            >
              <span className={styles.title} title={chat.title}>
                {chat.title.length > 20 ? `${chat.title.slice(0, 20)}…` : chat.title}
              </span>
              <button
                className={styles.deleteBtn}
                aria-label={sidebarValues.deleteChatTitle}
                title={sidebarValues.deleteChatTitle}
                onClick={(e) => {handleDelete(e, chat.id)}}
              >
                <DeleteIcon />
              </button>
            </div>
          ))
        )}
        </div>
        </div>}
      </div>
      <div className={styles.bottom}>
        <div className={styles.profile} title={sidebarValues.myProfile}>
          <ProfileIcon />
          {menuOpen && <span className={styles.label}>{sidebarValues.myProfile}</span>}
        </div>
      </div>
    </div>
  )
}

export default Sidebar