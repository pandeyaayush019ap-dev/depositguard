'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  FileQuestion,
  AlertOctagon,
  MessageSquareOff,
  CheckCircle2,
  ShieldCheck,
  FileCheck,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function ProblemSolution() {
  const problems = [
    {
      icon: FileQuestion,
      title: 'Unclear Condition Records',
      description:
        'Blurry smartphone pictures stored on old chat threads with no timestamps or mutual signoff leave room for endless finger-pointing.',
    },
    {
      icon: AlertOctagon,
      title: 'Unexplained Deductions',
      description:
        'Arbitrary repair deductions, full-wall repaint bills for ordinary wear-and-tear, and inflated invoices sprung on tenants at the last minute.',
    },
    {
      icon: MessageSquareOff,
      title: 'Scattered Communications',
      description:
        'Rental terms, key handovers, meter readings, and maintenance promises lost across emails, WhatsApp chats, and verbal assurances.',
    },
  ];

  const solutions = [
    {
      icon: ShieldCheck,
      title: 'Cryptographic Baseline Record',
      description:
        'Room-by-room move-in condition audit with high-resolution photo evidence and dual tenant-landlord timestamped signoff.',
    },
    {
      icon: Layers,
      title: 'Interactive Evidence Delta',
      description:
        'Side-by-side move-in vs move-out visual comparison that clearly isolates pre-existing defects from genuine tenancy damage.',
    },
    {
      icon: FileCheck,
      title: 'Transparent Settlement Ledger',
      description:
        'Decimal-safe calculation tracking proposed vs agreed deductions, disputed items, and real-time refundable balance.',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#07111F] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#102438] border border-white/10 text-xs font-semibold text-[#9BF5CC] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#16C784]" />
            Why Existing Rental Handshakes Fail
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            The traditional deposit return is broken on both sides.
          </h2>
          <p className="text-base sm:text-lg text-[#94A3B8] mt-4">
            Tenants fear unfair deductions. Landlords struggle to prove pre-existing vs new damage.
            DepositGuard replaces friction with an indisputable shared ledger.
          </p>
        </div>

        {/* 2-Column Comparison Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left: The Old Broken Way */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl bg-[#0C1B2B]/60 border border-red-500/20 p-6 sm:p-8 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <span className="text-xs uppercase font-extrabold tracking-wider text-red-400">
                  The Old Chaos • Informal Chats & Guesswork
                </span>
              </div>

              <div className="space-y-6">
                {problems.map((prob, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-[#07111F]/70 border border-white/5">
                    <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 shrink-0">
                      <prob.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">{prob.title}</h3>
                      <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 leading-relaxed">
                        {prob.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 text-xs text-red-300/80 font-medium">
              Result: Delayed deposit returns, hostile disputes, and financial anxiety for both parties.
            </div>
          </motion.div>

          {/* Right: The DepositGuard Solution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl bg-[#0C1B2B] border border-[#16C784]/30 p-6 sm:p-8 flex flex-col justify-between shadow-2xl glow-emerald"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-3 h-3 rounded-full bg-[#16C784] animate-pulse" />
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#9BF5CC]">
                  The DepositGuard Standard • One Shared Record
                </span>
              </div>

              <div className="space-y-6">
                {solutions.map((sol, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-[#102438] border border-[#16C784]/15">
                    <div className="p-2.5 rounded-xl bg-[#16C784]/15 text-[#16C784] shrink-0">
                      <sol.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">{sol.title}</h3>
                      <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 leading-relaxed">
                        {sol.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 text-xs text-[#9BF5CC] font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16C784]" />
              Result: Objective evidence, peaceful move-outs, and zero surprise deductions.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
