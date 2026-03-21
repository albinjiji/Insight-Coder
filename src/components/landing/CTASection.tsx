'use client'

import React from 'react'
import { landingPageValues, buttonLabels } from '@/constants/frontend-constants'
import styles from '@/styles/pages/landing-page.module.css'

interface CTASectionProps {
  onGetStarted: () => void
}

const CTASection: React.FC<CTASectionProps> = ({ onGetStarted }) => {
  return (
    <section className={styles.ctaSection}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-blue/5 blur-[120px] rounded-full" />
      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-up">
          <h2 className="font-geist font-black text-4xl md:text-6xl tracking-tighter text-text-primary">
            {landingPageValues.ctaTitlePrefix}<span className="bg-gradient-to-r from-accent-blue to-accent-violet bg-clip-text text-transparent">{landingPageValues.ctaTitleHighlight}</span>
          </h2>
          <button
            onClick={onGetStarted}
            className={`${styles.primaryButton}`}
          >
            {buttonLabels.getStarted}
          </button>
        </div>
      </div>
    </section>
  )
}

export default CTASection
