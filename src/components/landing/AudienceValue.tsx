'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  User,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FileText,
  DollarSign,
  Camera,
} from 'lucide-react';
import Link from 'next/link';

export default function AudienceValue() {
  const tenantBenefits = [
    'Document move-in baseline with high-res photos and timestamps before unpacking.',
    'Prevent unfair paint deductions by referencing mutual wear-and-tear definitions.',
    'Dispute inflated repair quotes directly in the app with an immutable audit log.',
    'Know your exact refund balance down to the rupee before handing back keys.',
  ];

  const landlordBenefits = [
    'Standardise inspection records across single flats or multiple managed units.',
    'Protect against false claims of pre-existing dampness or appliance malfunctions.',
    'Attach contractor repair receipts and Urban Company invoices directly to deductions.',
    'Close tenancies quickly with signed mutual clearance documents that avoid litigation.',
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#0C1B2B] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#102438] border border-white/10 text-xs font-semibold text-[#9BF5CC] mb-4">
            <Building2 className="w-3.5 h-3.5 text-[#16C784]" />
            Dual-Sided Trust Protocol
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Built for tenants who want proof. Landlords who want peace of mind.
          </h2>
          <p className="text-base sm:text-lg text-[#94A3B8] mt-4">
            A neutral, tamper-evident platform that removes the awkwardness and mistrust from
            rental deposit returns.
          </p>
        </div>

        {/* 2 Big Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tenant Panel */}
          <motion.div
            id="for-tenants"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl bg-[#07111F] border border-[#16C784]/20 p-8 sm:p-10 flex flex-col justify-between hover:border-[#16C784]/40 transition-colors shadow-xl"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#16C784]/15 border border-[#16C784]/30 flex items-center justify-center text-[#16C784]">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#9BF5CC] uppercase tracking-wider">
                    For Renters & Tenants
                  </span>
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    Never lose your hard-earned deposit again.
                  </h3>
                </div>
              </div>

              <p className="text-sm text-[#94A3B8] leading-relaxed mb-6">
                Moving home is stressful enough without wondering how much of your security deposit
                you will get back. DepositGuard arms you with objective proof from day one.
              </p>

              <div className="space-y-3.5 mb-8">
                {tenantBenefits.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#16C784] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-[#F7FAFC]/90">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/app"
              className="w-full py-3.5 rounded-xl bg-[#102438] hover:bg-[#162E48] border border-[#16C784]/30 text-white font-bold text-sm text-center transition-colors flex items-center justify-center gap-2"
            >
              <span>Get Protected as a Tenant</span>
              <ArrowRight className="w-4 h-4 text-[#16C784]" />
            </Link>
          </motion.div>

          {/* Landlord Panel */}
          <motion.div
            id="for-landlords"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl bg-[#07111F] border border-white/10 p-8 sm:p-10 flex flex-col justify-between hover:border-white/20 transition-colors shadow-xl"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                    For Landlords & Owners
                  </span>
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    Professional, dispute-free property handovers.
                  </h3>
                </div>
              </div>

              <p className="text-sm text-[#94A3B8] leading-relaxed mb-6">
                Maintain immaculate property condition records, justify legitimate repair deductions
                with undeniable photographic proof, and build trusting relationships with good tenants.
              </p>

              <div className="space-y-3.5 mb-8">
                {landlordBenefits.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-[#F7FAFC]/90">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/app"
              className="w-full py-3.5 rounded-xl bg-[#102438] hover:bg-[#162E48] border border-white/10 text-white font-bold text-sm text-center transition-colors flex items-center justify-center gap-2"
            >
              <span>Manage Properties as a Landlord</span>
              <ArrowRight className="w-4 h-4 text-sky-400" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
