'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { LightBulbIcon } from './Icons'
import { navbarValues, buttonLabels } from '@/constants/frontend-constants'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      document.documentElement.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
      document.documentElement.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[110] transition-all duration-300 ${isScrolled || isMobileMenuOpen ? 'bg-[#080B10]/95 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-8 md:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group relative z-[120]" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-violet flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all">
              <LightBulbIcon height="24px" width="24px" color="#080B10" />
            </div>
            <span className="font-geist font-black text-2xl text-white tracking-tighter">{navbarValues.logo}</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navbarValues.navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-geist-mono uppercase tracking-[0.2em] text-[10px] text-text-muted hover:text-accent-blue transition-colors relative group py-2"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent-blue transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            <Link
              href="/signin"
              className="ml-4 font-geist-mono text-[10px] uppercase tracking-widest border border-accent-blue/25 bg-accent-blue/5 text-accent-blue px-6 py-2.5 rounded-full hover:bg-accent-blue/10 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all relative overflow-hidden btn-shimmer group"
            >
              {buttonLabels.getStarted}
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative z-[120] w-10 h-10 flex flex-col items-center justify-center gap-2"
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-[10px]' : ''}`} />
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-[10px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Moved outside nav */}
      <div 
        className={`fixed inset-0 z-[105] flex flex-col items-center pt-40 pb-12 transition-all duration-500 md:hidden ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}
        style={{ backgroundColor: '#080B10' }}
      >
        <div className="flex flex-col items-center gap-10">
          {navbarValues.navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-geist font-bold text-3xl text-text-primary hover:text-accent-blue transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/signin"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-6 font-geist-mono text-xs uppercase tracking-[0.2em] border border-accent-blue/25 bg-accent-blue/5 text-accent-blue px-12 py-5 rounded-full shadow-[0_0_30px_rgba(59,130,246,0.1)]"
          >
            {buttonLabels.getStarted}
          </Link>
        </div>
        
        {/* Decorative elements for mobile menu */}
        <div className="mt-auto opacity-20 pointer-events-none">
           <div className="w-48 h-48 bg-accent-blue/10 blur-[100px] rounded-full" />
        </div>
      </div>
    </>
  )
}

export default Navbar
