import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { ArrowLeft, ShieldCheck, CheckCircle2, Lock, Scale, FileText } from 'lucide-react';

export default function TrustPage() {
  return (
    <div className="min-h-screen bg-[#07111F] text-[#F7FAFC] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#16C784] hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#102438] text-xs font-semibold text-[#9BF5CC] mb-4">
          <ShieldCheck className="w-3.5 h-3.5 text-[#16C784]" />
          Platform Integrity & Trust Architecture
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
          Trust & Security Specification
        </h1>
        <p className="text-sm text-[#94A3B8] mb-8">
          Detailed overview of DepositGuard&apos;s cryptographic audit principles, data access control, and
          operational integrity model.
        </p>

        <div className="space-y-8 text-sm text-[#94A3B8] leading-relaxed">
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl bg-[#0C1B2B] border border-white/10">
            <div className="flex items-center gap-2.5 mb-3">
              <Lock className="w-5 h-5 text-[#16C784]" />
              <h2 className="text-base font-bold text-white">1. Tamper-Evident Audit Trails</h2>
            </div>
            <p>
              Every event within a DepositGuard tenancy—including baseline room checklist creation, photo
              uploads, condition comments, deduction proposals, and mutual signoffs—is logged in a
              tamper-evident audit timeline. Once an inspection item is marked as mutually signed by both
              parties, any subsequent revisions are appended as explicit delta amendments rather than
              silently overwriting history.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl bg-[#0C1B2B] border border-white/10">
            <div className="flex items-center gap-2.5 mb-3">
              <Scale className="w-5 h-5 text-sky-400" />
              <h2 className="text-base font-bold text-white">2. Decimal-Safe Financial Calculations</h2>
            </div>
            <p>
              Deposit calculations adhere to strict decimal-safe accounting rules. A disputed deduction is
              never silently subtracted from the agreed refundable balance until both tenant and landlord
              explicitly acknowledge the resolved amount. This prevents premature or unilateral deductions
              from distorting the settlement record.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl bg-[#0C1B2B] border border-white/10">
            <div className="flex items-center gap-2.5 mb-3">
              <FileText className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white">3. Neutral Court-Ready Documentation</h2>
            </div>
            <p>
              DepositGuard generates structured Property Condition and Settlement Reports that can be
              downloaded as certified records. These reports contain timestamped photos, agreed tenancy
              clauses, itemized deduction logs, and digital acknowledgment statuses suitable for
              presentation during mediation, consumer dispute forums, or tenancy tribunals.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
