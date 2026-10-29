import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { ArrowLeft, Shield, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
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
          <Shield className="w-3.5 h-3.5 text-[#16C784]" />
          Legal Terms & Boundaries
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
          Terms of Service
        </h1>
        <p className="text-xs text-[#94A3B8] mb-8 font-mono">
          Last revised: October 2026 • Effective for all active tenancies
        </p>

        <div className="prose prose-invert max-w-none space-y-6 text-sm text-[#94A3B8] leading-relaxed">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs">
            <strong className="text-amber-300 font-bold block mb-1">Notice of Platform Boundaries:</strong>
            DepositGuard is a documentation and settlement tracking technology service. DepositGuard does
            not hold funds, manage escrow accounts, guarantee deposit refunds, or act as an arbiter or
            legal representative for either party.
          </div>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">1. The Nature of the Service</h2>
            <p>
              DepositGuard provides tools to assist tenants and landlords in documenting property
              condition, recording mutual agreements, comparing photographic records, and calculating
              proposed versus agreed deductions. The platform does not guarantee the recovery of any
              security deposit.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">2. User Responsibility & Evidence Authenticity</h2>
            <p>
              Users agree to provide accurate, unaltered photographic records and honest notes. Uploading
              fraudulent, manipulated, or misleading imagery constitutes a violation of these terms. Both
              parties acknowledge that photographs reflect condition only at the recorded time of capture.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">3. No Escrow or Financial Custody</h2>
            <p>
              DepositGuard does not receive, hold, transmit, or custody security deposits. Security
              deposits remain exclusively between the landlord and tenant pursuant to their underlying lease
              agreement. All refund transfers occur through external banking channels.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">4. Disputed Deductions</h2>
            <p>
              When a proposed deduction is flagged as disputed, DepositGuard provides a structured forum
              for evidence attachment and commentary. DepositGuard does not issue legally binding
              determinations of liability. Parties remain free to pursue independent conciliation or legal
              remedies under applicable tenancy laws.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
