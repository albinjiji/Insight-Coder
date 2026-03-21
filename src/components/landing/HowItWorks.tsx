'use client'

import React from 'react'
import { landingPageValues } from '@/constants/frontend-constants'
import styles from '@/styles/pages/landing-page.module.css'

const HowItWorks = () => {
  return (
    <section id="how-it-works" className={styles.howItWorksSection}>
      <div className="container mx-auto px-6">
        <div className={`${styles.sectionHeader} animate-fade-up`}>
          <h2 className={styles.sectionTitle}>{landingPageValues.howItWorksTitle}</h2>
          <p className="text-text-muted">{landingPageValues.howItWorksSubtitle}</p>
        </div>

        <div className={styles.stepGrid}>
          {landingPageValues.howItWorksSteps.map((step, i) => (
            <div key={i} className="group p-8 rounded-2xl bg-bg-base/50 border border-white/5 hover:border-accent-blue/20 hover:-translate-y-2 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="font-geist-mono text-xs font-bold text-accent-blue bg-accent-blue/10 border border-accent-blue/20 w-fit px-3 py-1 rounded-full mb-6">
                {step.step}
              </div>
              <h3 className="font-geist font-bold text-lg text-text-primary mb-3">{step.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
