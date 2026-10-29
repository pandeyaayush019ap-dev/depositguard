'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  FilePlus,
  Camera,
  Split,
  Calculator,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Create Rental Record',
      tagline: 'Lock in agreed terms and deposit',
      description:
        'Tenant or landlord inputs property details, security deposit amount, lease dates, and agreed wear-and-tear clauses with invite access.',
      icon: FilePlus,
      color: '#16C784',
      badge: 'Step 1 • Tenancy Setup',
    },
    {
      step: '02',
      title: 'Document Property Together',
      tagline: 'Move-in room-by-room photographic proof',
      description:
        'Walk through every room during key handover. Capture high-res photos, pre-existing nail holes, appliance conditions, and meter readings.',
      icon: Camera,
      color: '#38BDF8',
      badge: 'Step 2 • Baseline Audit',
    },
    {
      step: '03',
      title: 'Compare Move-Out Evidence',
      tagline: 'Split-screen side-by-side inspection',
      description:
        'At lease termination, repeat the photographic walkthrough. Our split comparison isolates actual wear-and-tear from confirmed new damage.',
      icon: Split,
      color: '#F5B942',
      badge: 'Step 3 • Delta Verification',
    },
    {
      step: '04',
      title: 'Track Settlement Balance',
      tagline: 'Itemized ledger & mutual signoff',
      description:
        'Proposed repair deductions are linked directly to evidence photos. Calculate refundable balance with mutual electronic acknowledgment.',
      icon: Calculator,
      color: '#9BF5CC',
      badge: 'Step 4 • Final Clearance',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-[#0C1B2B] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#102438] border border-[#16C784]/30 text-xs font-semibold text-[#9BF5CC] mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-[#16C784]" />
            A Structured 4-Step Methodology
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            How DepositGuard secures every rupee of your deposit.
          </h2>
          <p className="text-base sm:text-lg text-[#94A3B8] mt-4">
            From the day keys are handed over to final settlement day, both parties operate from an
            immutable single source of truth.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="rounded-3xl bg-[#07111F] border border-white/10 p-6 flex flex-col justify-between hover:border-[#16C784]/40 transition-all group"
            >
              <div>
                {/* Top Badge & Number */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/5 text-[#94A3B8]">
                    {step.badge}
                  </span>
                  <span className="text-2xl font-black font-mono text-white/20 group-hover:text-[#16C784] transition-colors">
                    {step.step}
                  </span>
                </div>

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-[#102438] border border-white/5"
                  style={{ color: step.color }}
                >
                  <step.icon className="w-6 h-6" />
                </div>

                {/* Title & Tagline */}
                <h3 className="text-lg font-bold text-white tracking-tight">{step.title}</h3>
                <p className="text-xs font-semibold text-[#9BF5CC] mt-1">{step.tagline}</p>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#94A3B8] mt-3 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-1.5 text-xs font-semibold text-white/70 group-hover:text-[#16C784] transition-colors">
                <span>Explore Phase {step.step}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
