'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  ArrowRight,
  Camera,
  FileCheck2,
  Lock,
  Layers,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import Apartment3DCanvas from '@/components/3d/Apartment3DCanvas';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-32">
      {/* Background radial gradients for depth */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-[#16C784]/15 to-[#38bdf8]/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-[#16C784]/5 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Messaging & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-6 flex flex-col items-start"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#102438] border border-[#16C784]/30 shadow-md mb-6">
              <span className="w-2 h-2 rounded-full bg-[#16C784]" />
              <span className="text-xs font-semibold text-[#9BF5CC]">
                Fintech-grade Proptech Documentation
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] mb-6">
              Your deposit deserves <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16C784] via-[#9BF5CC] to-white">proof</span>, not promises.
            </h1>

            {/* Supporting Copy */}
            <p className="text-lg sm:text-xl text-[#94A3B8] leading-relaxed mb-8 max-w-xl">
              Document your property&apos;s condition, keep rental terms organised, and track deposit
              settlements with one shared record built for tenants and landlords.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-8">
              <Link
                href="/app"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#16C784] to-[#12A86E] text-[#07111F] font-black text-base shadow-xl shadow-[#16C784]/25 hover:shadow-[#16C784]/40 hover:opacity-95 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Protect My Deposit</span>
                <ArrowRight className="w-5 h-5 text-[#07111F] group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#how-it-works"
                className="px-7 py-4 rounded-2xl bg-[#0C1B2B] hover:bg-[#102438] border border-white/10 text-white font-semibold text-base transition-colors flex items-center justify-center gap-2"
              >
                Explore How It Works
              </a>
            </div>

            {/* Supporting Trust Line */}
            <div className="flex items-center gap-2 text-xs font-medium text-[#94A3B8] mb-8">
              <Sparkles className="w-4 h-4 text-[#16C784]" />
              <span>Clear records. Shared evidence. More transparent settlements.</span>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-6 w-full max-w-lg">
              <div>
                <div className="text-xl sm:text-2xl font-black text-white tracking-tight">₹2.4M+</div>
                <div className="text-[11px] font-medium text-[#94A3B8] mt-0.5">Deposits Documented</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#16C784] tracking-tight">100%</div>
                <div className="text-[11px] font-medium text-[#94A3B8] mt-0.5">Shared Audit Trail</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white tracking-tight">0</div>
                <div className="text-[11px] font-medium text-[#94A3B8] mt-0.5">Hidden Deductions</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: 3D Architectural Scene */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
            className="lg:col-span-6 relative"
          >
            <Apartment3DCanvas />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
