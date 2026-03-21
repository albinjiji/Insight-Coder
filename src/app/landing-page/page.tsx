'use client';

import React from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Hero from '@/components/landing/Hero'
import Mockup from '@/components/landing/Mockup'
import Features from '@/components/landing/Features'
import HowItWorks from '@/components/landing/HowItWorks'
import CTASection from '@/components/landing/CTASection'
import Footer from '@/components/landing/Footer'
import { landingPageValues } from '@/constants/frontend-constants'
import styles from '@/styles/pages/landing-page.module.css'

const LandingPage = () => {
  const router = useRouter()

  const handleNavigation = () => {
    router.push('/signin')
  }

  return (
    <div className="bg-bg-base text-text-primary min-h-screen font-geist selection:bg-accent-blue/30 selection:text-accent-blue">
      <Navbar />
      
      {/* Hero Section */}
      <section className={styles.heroSection}>
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-blue/10 blur-[120px] rounded-full animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent-violet/10 blur-[150px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 brightness-50 mix-blend-overlay" />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <Hero onGetStarted={handleNavigation} />
        <Mockup />

        {/* Scroll Hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="font-geist-mono text-[10px] uppercase tracking-[0.3em] text-accent-blue/50">{landingPageValues.heroScroll}</span>
          <div className="w-4 h-4 border-r border-b border-accent-blue/35 rotate-45" />
        </div>
      </section>

      <Features />
      <HowItWorks />
      <CTASection onGetStarted={handleNavigation} />
      <Footer />
    </div>
  )
}

export default LandingPage
