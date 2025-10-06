import React from 'react'
import MainPanel from '@/components/main-panel';
import Sidebar from '@/components/sidebar'
import styles from '../../styles/pages/home-page.module.css'

function HomePage() {
  
  return (
    <div className={styles.app}>
      <Sidebar />
      <MainPanel />
    </div>
  )
}

export default HomePage