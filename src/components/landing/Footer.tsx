'use client'

import React, { useState, useEffect } from 'react'
import { LightBulbIcon } from '@/components/Icons'
import { landingPageValues } from '@/constants/frontend-constants'
import styles from '@/styles/pages/landing-page.module.css'

const Footer = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <footer className={styles.footer}>
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-accent-blue to-accent-violet flex items-center justify-center">
            <LightBulbIcon height="18px" width="18px" color="#080B10" />
          </div>
          <span className="font-geist font-extrabold text-xl text-text-primary">{landingPageValues.header}</span>
        </div>
        <p className="font-geist-mono text-[10px] uppercase tracking-widest text-text-muted/60">
          © {mounted ? new Date().getFullYear() : '2026'}{landingPageValues.footerCopyrightSuffix}
        </p>
      </div>
    </footer>
  )
}

export default Footer
