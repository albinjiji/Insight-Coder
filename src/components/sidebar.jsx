'use client';
import React from 'react'
import styles from '../styles/components/sidebar.module.css'
import { LightBulbIcon, PlusIcon } from './icons'
import { landingPageValues, sidebarValues } from '@/constants/frontend-constants'
import { useRouter } from 'next/navigation'

function Sidebar() {

  const router = useRouter();
  const handleNavigation = () => {
    router.push('/landing-page');
  };

  const handleNewChat = () => {
    router.push('/home-page');
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo} onClick={handleNavigation}><LightBulbIcon height="30px" width="30px" />{landingPageValues.header}</div>
      <button className={styles.newReview} onClick={handleNewChat}>
        <label className={styles.new}>{sidebarValues.newChat}</label>
        <PlusIcon />
      </button>
      <div className={styles.history}>
        <h4>June 2025</h4>
        <p>utils.py</p>
        <h4>May 2025</h4>
        <p>Refactoring Dashboard</p>
        <p>Improving Performance</p>
      </div>
      <div className={styles.bottom}>
        <button className={styles.getApp}>📱 Get App</button>
        <div className={styles.profile}>🧑 My Profile</div>
      </div>
    </div>
  )
}

export default Sidebar