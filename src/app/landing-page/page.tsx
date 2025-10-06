'use client';
import React from 'react'

import styles from '../../styles/pages/landing-page.module.css'
import { buttonLabels, landingPageValues } from '../../constants/frontend-constants'
import { LightBulbIcon } from '@/components/icons'
import { useRouter } from 'next/navigation'

const LandingPage = () => {

  const router = useRouter()

  const handleNavigation = () => {
    router.push('/home-page');
  };
 
  return (
    <div className={styles.container}>
      
      {/* page-scoped background */}
      <div className={styles.bgGridOverlay} aria-hidden />
      <div className={styles.grid3d} aria-hidden />

      {/* real content above bg */}
      <div className={styles.logo}>
        <span className={styles.logoIcon}><LightBulbIcon height="56px" width="56px" /></span>
        <h1 className={styles.header}>{landingPageValues.header}</h1>
      </div>
      <h2 className={styles.heading}>{landingPageValues.subHeaderOne}<br />{landingPageValues.subHeaderTwo}</h2>
      <p className={styles.description}>{landingPageValues.description}</p>
      <div className={styles.buttons}>
        <button className={styles.primary} onClick={handleNavigation}>{buttonLabels.getStarted}</button>
      </div>
      <footer className={styles.footer}>{landingPageValues.header}</footer>
    </div>
  )
}

export default LandingPage
