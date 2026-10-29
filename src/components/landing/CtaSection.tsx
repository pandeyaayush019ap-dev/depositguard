'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function CtaSection() {
  return (
    <section className="py-20 lg:py-28 bg-[#0C1B2B] border-t border-white/5 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#16C784]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#102438] border border-[#16C784]/30 text-xs font-semibold text-[#9BF5CC] mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#16C784]" />
          Instant Tenancy Baseline
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-6">
          Make your next rental move with clearer records.
        </h2>

        <p className="text-base sm:text-xl text-[#94A3B8] max-w-2xl mx-auto mb-10 leading-relaxed">
          Start documenting your rental journey before the first dispute happens. Both you and your
          landlord will thank each other on move-out day.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/app/properties/new"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#16C784] to-[#12A86E] text-[#07111F] font-black text-base shadow-xl shadow-[#16C784]/25 hover:shadow-[#16C784]/40 hover:opacity-95 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Create Your Rental Record</span>
            <ArrowRight className="w-5 h-5 text-[#07111F] group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/app"
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#07111F] hover:bg-[#102438] border border-white/10 text-white font-semibold text-base transition-colors flex items-center justify-center gap-2"
          >
            Launch Interactive Dashboard
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#94A3B8]">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#16C784]" />
            Free demo walkthrough
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#16C784]" />
            No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#16C784]" />
            Instant PDF report export
          </span>
        </div>
      </div>
    </section>
  );
}
