'use client';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from '../styles/components/Sidebar.module.css'
import { CloseIcon, DeleteIcon, MenuIcon, PlusIcon, ProfileIcon } from './Icons'
import { sidebarValues } from '@/constants/frontend-constants'
import {
  selectHistory,
  restoreSession,
  newSession,
  HistoryItem,
  // selectCurrentChatId // We'll handle "active" state by checking if current workspace matches a history item or just highlight last clicked
} from '@/features/chat/chat-slice'

interface SidebarProps {
  // Traditional chat props kept for compatibility if needed, but we'll focus on HistoryItem
  activeChatId?: string;
  chats?: { id: string; title: string }[];
  onDeleteChat?: (id: string) => void;
  onNewChat?: () => void;
  onSelectChat?: (id: string) => void;
}

function Sidebar({
  activeChatId, // This might be used for chat mode specifically
}: SidebarProps) {
  const dispatch = useDispatch();
  const history = useSelector(selectHistory);
  const [menuOpen, setMenuOpen] = useState(true);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNewSession = () => {
    dispatch(newSession());
    setActiveSessionId(null);
  };

  const handleRestoreSession = (item: HistoryItem) => {
    dispatch(restoreSession(item));
    setActiveSessionId(item.id);
  };

  const handleDeleteHistory = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    // For now, we don't have a deleteHistory action, but we could add one.
    // Let's just focus on restoration as per requirements.
  };

  return (
    <div className={`${styles.sidebar} ${menuOpen ? styles.open : styles.closed}`}>
      <div className={styles.header}>
        <div className={styles.logo} onClick={toggleMenu} title={menuOpen ? "Close sidebar" : "Open sidebar"}>
          <MenuIcon />
          {/* {menuOpen && <span>InsightCoder</span>} */}
        </div>
        <button
          className={styles.closeButton}
          onClick={toggleMenu}
          title={"Close sidebar"}>
          {menuOpen && <CloseIcon />}
        </button>
      </div>

      <div className={styles.menu}>
        <button className={styles.newReview} onClick={handleNewSession} title="Start new session">
          <PlusIcon />
          {menuOpen && <label className={styles.label}>New Session</label>}
        </button>

        {menuOpen && (
          <div className={styles.history}>
            <h4>Analysis History</h4>
            <div className={styles.chatList}>
              {history.length === 0 ? (
                <p className={styles.empty}>No recent analyses</p>
              ) : (
                history.map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleRestoreSession(item)}
                    className={`${styles.chatItem} ${item.id === activeSessionId ? styles.active : ''}`}
                  >
                    <div className={styles.itemHeader}>
                      <span className={styles.modeBadge}>{item.mode}</span>
                      <span className={styles.timestamp}>{item.timestamp}</span>
                    </div>
                    <div className={styles.previewText}>
                      {item.preview}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
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