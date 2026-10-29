'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  ShieldAlert,
  Lock,
  FileCheck,
  Eye,
  Info,
  CheckCircle2,
  AlertTriangle,
  Scale,
} from 'lucide-react';
import Link from 'next/link';

export default function TrustSecurity() {
  const securityCapabilities = [
    {
      icon: Lock,
      title: 'Tamper-Evident Timestamping',
      description:
        'Every photograph, condition note, and signed acknowledgement is stored with an immutable UTC timestamp and participant role identifier.',
    },
    {
      icon: Eye,
      title: 'Strict Participant-Only Access',
      description:
        'Only verified tenants, landlords, and designated property managers associated with a specific rental unit can view property photographs and inspection logs.',
    },
    {
      icon: FileCheck,
      title: 'Dual-Key Mutual Electronic Signoff',
      description:
        'Inspection checklists and settlement balances cannot be modified without logging an explicit modification record visible to both parties.',
    },
    {
      icon: Scale,
      title: 'Neutral Evidence Repository',
      description:
        'DepositGuard serves as an unbiased digital record that both parties can export as a certified PDF report for mediation or legal review.',
    },
  ];

  return (
    <section id="trust-security" className="py-20 lg:py-28 bg-[#07111F] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#102438] border border-white/10 text-xs font-semibold text-[#9BF5CC] mb-4">
            <Lock className="w-3.5 h-3.5 text-[#16C784]" />
            Honest Security & Clear Legal Boundaries
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Trust built on real evidence, not empty marketing claims.
          </h2>
          <p className="text-base sm:text-lg text-[#94A3B8] mt-4">
            We believe fintech and proptech tools should be completely honest about what they do and
            what they do not do.
          </p>
        </div>

        {/* 4 Security Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {securityCapabilities.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-6 rounded-3xl bg-[#0C1B2B] border border-white/10 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#16C784]/15 text-[#16C784] flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">{item.title}</h3>
                <p className="text-xs sm:text-sm text-[#94A3B8] mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Explicit Legal Boundaries Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#102438] border border-amber-500/30 max-w-4xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white tracking-tight mb-2">
                Our Explicit Legal & Operational Boundaries
              </h4>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed mb-4">
                To maintain regulatory compliance and authentic trust, DepositGuard explicitly states:
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-[#F7FAFC]/80 list-disc list-inside">
                <li>
                  <strong>Documentation & Settlement Tracking:</strong> DepositGuard is an evidence
                  documentation platform. It is <strong>not</strong> an escrow custodian or regulated deposit holder.
                </li>
                <li>
                  <strong>No Automatic Money Transfers:</strong> Deposit balances are transferred
                  directly between tenant and landlord via mutually agreed banking channels (e.g., NEFT/RTGS/UPI).
                </li>
                <li>
                  <strong>Evidence, Not Legal Judgment:</strong> Our before-and-after photo tools
                  organise evidence for human review. They do not make binding legal rulings on liability.
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-3">
                <Link
                  href="/trust"
                  className="text-xs font-bold text-[#16C784] hover:underline flex items-center gap-1"
                >
                  Read full Trust & Security Architecture Specification →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
