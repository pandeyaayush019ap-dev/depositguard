'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, Menu, X, ArrowRight, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'For Tenants', href: '#for-tenants' },
    { label: 'For Landlords', href: '#for-landlords' },
    { label: 'Product Tour', href: '#product-showcase' },
    { label: 'Trust & Security', href: '#trust-security' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#07111F]/80 border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16C784] rounded-lg">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#16C784] to-[#0C1B2B] p-0.5 flex items-center justify-center shadow-lg shadow-[#16C784]/20 group-hover:shadow-[#16C784]/40 transition-shadow">
            <div className="w-full h-full bg-[#07111F] rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#16C784]" />
            </div>
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
              Deposit<span className="text-[#16C784]">Guard</span>
            </span>
            <span className="hidden sm:block text-[10px] tracking-widest uppercase font-semibold text-[#94A3B8]">
              Rental Evidence Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#94A3B8]" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-[#F7FAFC] transition-colors focus-visible:outline-none focus-visible:text-[#16C784]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/auth/signin"
            className="px-4 py-2 rounded-xl text-sm font-semibold text-[#F7FAFC] hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16C784]"
          >
            Sign In
          </Link>
          <Link
            href="/app"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#16C784] to-[#12A86E] text-[#07111F] text-sm font-bold shadow-lg shadow-[#16C784]/25 hover:shadow-[#16C784]/40 hover:opacity-95 transition-all flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <span>Launch App</span>
            <ArrowRight className="w-4 h-4 text-[#07111F]" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <Link
            href="/app"
            className="sm:hidden px-3.5 py-1.5 rounded-lg bg-[#16C784] text-[#07111F] text-xs font-bold"
          >
            App
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#94A3B8] hover:text-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16C784]"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0C1B2B] border-b border-white/10 px-6 py-6 overflow-hidden"
          >
            <nav className="flex flex-col gap-4 text-base font-medium text-[#94A3B8]">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                <Link
                  href="/auth/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-white/10 text-white font-semibold text-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/app"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-[#16C784] text-[#07111F] font-bold text-sm"
                >
                  Launch App
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
