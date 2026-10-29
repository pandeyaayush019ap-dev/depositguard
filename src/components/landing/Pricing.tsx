'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Check, ShieldCheck, Sparkles, ArrowRight, Info } from 'lucide-react';
import Link from 'next/link';

export default function Pricing() {
  const plans = [
    {
      name: 'Tenant Protection',
      price: '₹499',
      billing: 'One-time fee per tenancy',
      badge: 'Most Popular for Renters',
      popular: true,
      description: 'Everything a tenant needs to document move-in condition and track deposit return.',
      features: [
        'Move-in & move-out photographic checklists',
        'Dual-signoff timestamped property report',
        'Side-by-side difference comparison tool',
        'Deduction tracking & refund balance calculator',
        'Downloadable certified PDF condition certificate',
        'Secure cloud evidence retention for lease duration',
      ],
      ctaLabel: 'Start Free Preview in App',
      ctaHref: '/app',
    },
    {
      name: 'Enhanced Documentation',
      price: '₹1,499',
      billing: 'One-time fee per tenancy',
      badge: 'Comprehensive Assurance',
      popular: false,
      description: 'Expanded evidence archival with appliance video walkthrough logs and priority mediation export.',
      features: [
        'Everything in Tenant Protection',
        'Up to 100 high-resolution evidence uploads',
        'Meter reading photo logs (electricity, water, gas)',
        'Itemized repair contractor invoice uploads',
        'Certified formal Dispute Report for mediation',
        'Extended 3-year post-lease record archive',
      ],
      ctaLabel: 'Preview Enhanced Suite',
      ctaHref: '/app',
    },
    {
      name: 'Landlord / Portfolio',
      price: 'Custom / Pilot',
      billing: 'Validating commercial pilot pricing',
      badge: 'Property Owners & Managers',
      popular: false,
      description: 'Centralised deposit evidence and handover management across multiple apartments.',
      features: [
        'Multi-property management dashboard',
        'Bulk tenant onboarding & invitation links',
        'Standardised turnover inspection templates',
        'Integrated contractor invoice reconciliation',
        'Audit-ready tenancy compliance logs',
        'Dedicated onboarding support',
      ],
      ctaLabel: 'Request Pilot Access',
      ctaHref: '/app',
    },
  ];

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-[#0C1B2B] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#102438] border border-white/10 text-xs font-semibold text-[#9BF5CC] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#16C784]" />
            Transparent Tenancy Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            A small investment to protect lakhs in security deposits.
          </h2>
          <p className="text-base sm:text-lg text-[#94A3B8] mt-4">
            Clear, honest pricing with zero hidden commissions. (Proposed commercial assumptions for
            early platform adopters).
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all relative ${
                plan.popular
                  ? 'bg-[#07111F] border-2 border-[#16C784] shadow-2xl glow-emerald'
                  : 'bg-[#07111F] border border-white/10 hover:border-white/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#16C784] text-[#07111F] text-xs font-extrabold uppercase tracking-wider shadow-md">
                  {plan.badge}
                </div>
              )}

              <div>
                <div className="text-lg font-bold text-white mb-1">{plan.name}</div>
                <p className="text-xs text-[#94A3B8] mb-6 min-h-[36px]">{plan.description}</p>

                <div className="mb-6 pb-6 border-b border-white/10">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      {plan.price}
                    </span>
                  </div>
                  <div className="text-xs text-[#94A3B8] mt-1">{plan.billing}</div>
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-[#16C784] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-[#F7FAFC]/90">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href={plan.ctaHref}
                className={`w-full py-3.5 rounded-xl font-bold text-sm text-center transition-all flex items-center justify-center gap-2 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-[#16C784] to-[#12A86E] text-[#07111F] shadow-lg hover:opacity-95'
                    : 'bg-[#102438] hover:bg-[#162E48] text-white border border-white/10'
                }`}
              >
                <span>{plan.ctaLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Pricing Notice */}
        <div className="mt-12 text-center text-xs text-[#94A3B8] flex items-center justify-center gap-2 max-w-xl mx-auto">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Payment gateway integration is currently in private beta testing. All features in the
            application are currently unlocked for test drives and early validation.
          </span>
        </div>
      </div>
    </section>
  );
}
