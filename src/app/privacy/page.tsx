import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { ArrowLeft, Lock, EyeOff } from 'lucide-react';

export default function PrivacyPage() {
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
          <Lock className="w-3.5 h-3.5 text-[#16C784]" />
          Privacy & Evidence Retention
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#94A3B8] mb-8 font-mono">
          Last revised: October 2026 • Evidence security standards
        </p>

        <div className="prose prose-invert max-w-none space-y-6 text-sm text-[#94A3B8] leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-2">1. Information We Collect</h2>
            <p>
              DepositGuard collects user identity details (name, email address, role), property addresses,
              inspection photographic evidence, condition descriptions, agreed lease clauses, and itemized
              deduction notes submitted by authorised tenancy participants.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">2. How Evidence Is Isolated</h2>
            <p>
              Your property photographs and inspection logs are restricted strictly to confirmed
              participants of that specific tenancy (the invited tenant, verified landlord, and authorised
              property manager). Inspection evidence is never indexed on public search engines or shared
              with third-party advertisers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">3. Evidence Retention Schedule</h2>
            <p>
              Tenancy records and high-resolution photographs are retained for the active duration of the
              lease plus an archival post-settlement period (typically 12 months for standard tiers or 36
              months for enhanced tiers) to protect against delayed claims or statutory dispute filings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">4. User Rights & Data Deletion</h2>
            <p>
              Following mutual settlement signoff and expiration of the statutory dispute window, both
              parties may mutually request the expungement of personal identification and media records.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
