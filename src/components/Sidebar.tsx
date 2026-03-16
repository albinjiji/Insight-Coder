'use client';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import styles from '../styles/components/Sidebar.module.css'
import { CloseIcon, DeleteIcon, MenuIcon, PlusIcon, ProfileIcon } from './Icons'
import { sidebarValues } from '@/constants/frontend-constants'
import {
  selectHistory,
  restoreSession,
  newSession,
  HistoryItem,
} from '@/features/chat/chat-slice'
import { selectAuthUser } from '@/features/auth/auth-slice'
import { createClient } from '@/lib/supabase/client'

interface SidebarProps {
  activeChatId?: string;
  chats?: { id: string; title: string }[];
  onDeleteChat?: (id: string) => void;
  onNewChat?: () => void;
  onSelectChat?: (id: string) => void;
}

function Sidebar({
  activeChatId,
}: SidebarProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const history = useSelector(selectHistory);
  const user = useSelector(selectAuthUser);
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
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/signin');
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
          {menuOpen && (
            <div className={styles.profileInfo}>
              <span className={`${styles.label} ${styles.emailLabel}`}>
                {user?.email || 'Not signed in'}
              </span>
              <button
                onClick={handleSignOut}
                className={styles.signOutButton}
                title="Sign out of InsightCoder"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Sidebar