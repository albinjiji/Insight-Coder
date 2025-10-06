'use client';
import React, { useState } from 'react'
import styles from '../styles/components/sidebar.module.css'
import { CloseIcon, LightBulbIcon, MenuIcon, PlusIcon, ProfileIcon, RightAngleIcon } from './icons'
import { landingPageValues, sidebarValues } from '@/constants/frontend-constants'
import { useRouter } from 'next/navigation'

function Sidebar() {

  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(true);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNewChat = () => {
    router.push('/home-page');
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
        <button className={styles.newReview} onClick={handleNewChat} title="New Session">
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