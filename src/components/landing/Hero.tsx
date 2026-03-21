'use client'

import React from 'react'
import { LightBulbIcon } from '@/components/Icons'
import { landingPageValues, buttonLabels } from '@/constants/frontend-constants'
import styles from '@/styles/pages/landing-page.module.css'

interface HeroProps {
  onGetStarted: () => void
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  return (
    <div className={styles.heroContent}>
      <div className={`${styles.brandHeader} animate-fade-up`} style={{ animationDelay: '50ms' }}>
        <div className={styles.brandIcon}>
          <LightBulbIcon height="36px" width="36px" color="#080B10" />
        </div>
        <span className={styles.brandTitle}>{landingPageValues.header}</span>
      </div>

      {/* Badge */}
      <div className={`${styles.badge} animate-fade-up`} style={{ animationDelay: '100ms' }}>
        <div className={styles.badgeBorder} />
        <span className={styles.badgeDot} />
        <span className={styles.badgeText}>
          {landingPageValues.heroBadge}
        </span>
      </div>

      {/* Headline */}
      <h1 className={`${styles.headline} animate-fade-up`} style={{ animationDelay: '200ms' }}>
        {landingPageValues.subHeaderOne} <br />
        <span className="text-text-primary">{landingPageValues.subHeaderTwo}</span>
      </h1>

      <p className={`${styles.subheading} animate-fade-up`} style={{ animationDelay: '400ms' }}>
        {landingPageValues.description}
      </p>

      {/* CTA Group */}
      <div className={`${styles.ctaGroup} animate-fade-up`} style={{ animationDelay: '600ms' }}>
        <button
          onClick={onGetStarted}
          className={`${styles.primaryButton} btn-shimmer`}
        >
          {buttonLabels.getStarted}
        </button>
      </div>
    </div>
  )
}

export default Hero
