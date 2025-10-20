'use client';
import React, { useState } from 'react'
import styles from '../styles/components/sidebar.module.css'
import { CloseIcon, MenuIcon, PlusIcon, ProfileIcon } from './icons'
import { sidebarValues } from '@/constants/frontend-constants'

interface SideBarProps {
  onNewChat: () => void;
}

function Sidebar({
  onNewChat,
}: SideBarProps) {

  const [menuOpen, setMenuOpen] = useState(true);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
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
        <button className={styles.newReview} onClick={onNewChat} title="New Session">
          <PlusIcon />
          {menuOpen && <label className={styles.label}>{sidebarValues.newSession}</label>}
        </button>

        <div className={styles.history}>
          {menuOpen && <h4>{sidebarValues.sessions}</h4>}
        </div>
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