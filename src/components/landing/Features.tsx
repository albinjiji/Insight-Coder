'use client'

import React from 'react'
import { LightBulbIcon } from '@/components/Icons'
import { landingPageValues } from '@/constants/frontend-constants'
import styles from '@/styles/pages/landing-page.module.css'

const Features = () => {
  return (
    <section id="features" className={styles.featuresSection}>
      <div className="container mx-auto px-6 relative z-10">
        <div className={`${styles.sectionHeader} animate-fade-up`}>
          <span className={styles.sectionLabel}>{landingPageValues.featuresLabel}</span>
          <h2 className={styles.sectionTitle}>
            {landingPageValues.featuresTitle}
          </h2>
          <p className="text-text-muted max-w-xl mx-auto">
            {landingPageValues.featuresSubtitle}
          </p>
        </div>

        <div className={styles.featureGrid}>
          {landingPageValues.featuresList.map((feature, i) => (
            <div key={i} className={`${styles.featureCard} animate-fade-in`} style={{ animationDelay: `${i * 100}ms`, opacity: 0, animationFillMode: 'forwards' }}>
              <div className={styles.featureIcon}>
                <LightBulbIcon height="24px" width="24px" />
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.desc}</p>
              <span className={styles.featureTag}>
                {feature.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
