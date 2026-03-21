'use client'

import React, { useState, useEffect } from 'react'
import { landingPageValues, mockupValues, featureModes } from '@/constants/frontend-constants'
import styles from '@/styles/pages/landing-page.module.css'

const Mockup = () => {
  const [typedText, setTypedText] = useState('')
  const [animationPhase, setAnimationPhase] = useState<'typing' | 'clicking' | 'analyzing' | 'result'>('typing')

  useEffect(() => {
    const fullText = mockupValues.fullTextAnimation
    let index = 0
    let timeout: NodeJS.Timeout | null = null

    const runAnimation = () => {
      if (animationPhase === 'typing') {
        if (index < fullText.length) {
          setTypedText(fullText.slice(0, index + 1))
          index++
          timeout = setTimeout(runAnimation, 50)
        } else {
          timeout = setTimeout(() => setAnimationPhase('clicking'), 1000)
        }
      } else if (animationPhase === 'clicking') {
        timeout = setTimeout(() => setAnimationPhase('analyzing'), 500)
      } else if (animationPhase === 'analyzing') {
        timeout = setTimeout(() => setAnimationPhase('result'), 1500)
      } else if (animationPhase === 'result') {
        timeout = setTimeout(() => {
          setAnimationPhase('typing')
          setTypedText('')
          index = 0
        }, 4000)
      }
    }

    runAnimation()
    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [animationPhase])

  const getAnalysisContent = () => {
    switch (animationPhase) {
      case 'typing':
        return (
          <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 text-center gap-4 md:gap-5">
            <div className="text-3xl md:text-4xl">{mockupValues.placeholderIcon}</div>
            <p className="text-[10px] md:text-[11px] text-text-muted/80 max-w-[200px] leading-relaxed font-geist">
              {mockupValues.placeholderText}
            </p>
          </div>
        )
      case 'clicking':
      case 'analyzing':
        return (
          <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 text-center gap-4 md:gap-5">
            <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin" />
            <p className="text-[10px] md:text-[11px] text-accent-blue animate-pulse font-geist-mono">
              {mockupValues.analyzingText}
            </p>
          </div>
        )
      case 'result':
        return (
          <div className={`${styles.analysisResult} flex-1 p-4 md:p-6 font-geist text-left overflow-y-auto`}>
            <h4 className="text-accent-blue text-[10px] font-bold uppercase tracking-widest mb-3">{mockupValues.resultTitle}</h4>
            <div className="space-y-4">
              {mockupValues.analysisResults.map((result, i) => (
                <div key={i} className={`${result.type === 'success' ? 'bg-green-500/10 border-green-500/20' : 'bg-white/5 border-white/5'} border p-3 rounded-lg`}>
                  <p className={`text-[10px] ${result.type === 'accent' ? 'text-accent-blue' : result.type === 'success' ? 'text-green-400' : 'text-text-primary'} font-bold mb-1`}>{result.label}</p>
                  <p className="text-[9px] text-text-muted">{result.text}</p>
                </div>
              ))}
            </div>
          </div>
        )
    }
  }

  return (
    <div className={styles.mockupWrapper}>
      <div className={`${styles.mockupContainer} animate-fade-up`}>
        {/* Sidebar */}
        <div className={styles.mockupSidebar}>
          <div className="w-6 h-0.5 bg-white/20 rounded-full" />
          <div className="w-6 h-0.5 bg-white/20 rounded-full" />
          <div className="w-6 h-0.5 bg-white/20 rounded-full" />
          
          <div className="mt-4 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
            <div className={`w-4 h-4 rounded-full border-2 ${animationPhase === 'typing' ? 'border-accent-blue' : 'border-white/20'} flex items-center justify-center transition-colors`}>
              <div className={`w-1.5 h-1.5 ${animationPhase === 'typing' ? 'bg-accent-blue' : 'bg-white/20'} rounded-full transition-colors`} />
            </div>
          </div>

          <div className="mt-auto w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
              <div className="w-5 h-5 rounded-full border-2 border-white/30" />
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.mockupMain}>
          {/* App Bar */}
          <div className={styles.mockupAppBar}>
            <div className="flex items-center gap-1.5 md:gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              <span className="font-geist font-black text-xs md:text-sm tracking-tight">{landingPageValues.header}</span>
              <span className="text-[8px] md:text-[9px] font-geist-mono bg-accent-blue/10 text-accent-blue px-1.5 py-0.5 rounded border border-accent-blue/20">AI</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-2 md:px-3 py-1 md:py-1.5 rounded-md text-[9px] md:text-[10px] text-text-muted border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
              <span>{mockupValues.modelName}</span>
              <div className="w-1.5 h-1.5 border-r border-b border-current rotate-45 mb-1" />
            </div>
          </div>

          {/* Tabs */}
          <div className={styles.mockupTabs}>
            {featureModes.map((tab, i) => (
              <div key={tab.id} className={`${styles.mockupTab} ${i === 0 ? styles.mockupTabActive : ''} cursor-pointer hover:text-text-primary transition-colors`}>
                <span className="text-sm">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </div>
            ))}
          </div>

          {/* Panes */}
          <div className={styles.mockupContent}>
            {/* Editor Pane */}
            <div className={styles.mockupPane}>
                <div className={styles.mockupPaneHeader}>
                  <div className={styles.mockupPaneTitle}>
                    <div className={styles.mockupDots}>
                      <div className={`${styles.mockupDot} bg-[#FF5F56]`} />
                      <div className={`${styles.mockupDot} bg-[#FFBD2E]`} />
                      <div className={`${styles.mockupDot} bg-[#27C93F]`} />
                    </div>
                    <span>{mockupValues.editorLabel}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[8px] md:text-[10px] text-text-muted bg-white/5 px-1.5 md:px-2 py-0.5 rounded border border-white/5">
                    <span>{mockupValues.defaultLanguage}</span>
                    <div className="w-1 h-1 border-r border-b border-current rotate-45 mb-0.5" />
                  </div>
                </div>
              <div className="p-6 font-geist-mono text-[11px] leading-relaxed overflow-hidden">
                <pre className="text-accent-blue whitespace-pre-wrap">
                  {typedText}
                  {animationPhase === 'typing' && <span className={styles.typingCursor} />}
                </pre>
              </div>
            </div>

            {/* Analysis Pane */}
            <div className={styles.mockupPane}>
              <div className={styles.mockupPaneHeader}>
                <div className={styles.mockupPaneTitle}>
                  <div className={styles.mockupDots}>
                    <div className={`${styles.mockupDot} bg-[#FF5F56]`} />
                    <div className={`${styles.mockupDot} bg-[#FFBD2E]`} />
                    <div className={`${styles.mockupDot} bg-[#27C93F]`} />
                  </div>
                  <span>{mockupValues.analysisLabel}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-accent-blue/60 bg-accent-blue/5 px-2 py-0.5 rounded border border-accent-blue/10">
                  <span>{mockupValues.liveStatus}</span>
                  <div className="w-1.5 h-1.5 bg-accent-blue rounded-full animate-pulse" />
                </div>
              </div>
              {getAnalysisContent()}
            </div>
          </div>

          {/* Bottom Button */}
          <div className={styles.mockupFooter}>
            <button className={`${styles.mockupButton} ${animationPhase === 'clicking' ? styles.mockupButtonActive : ''}`}>
              <span className="text-lg">💡</span>
              <span>{mockupValues.explainBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Mockup
