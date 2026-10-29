'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className="bg-[#07111F] border-t border-white/10 text-[#94A3B8] text-xs pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#16C784] flex items-center justify-center text-[#07111F]">
                <Shield className="w-4 h-4 font-black" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                Deposit<span className="text-[#16C784]">Guard</span>
              </span>
            </Link>
            <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">
              Your deposit deserves proof, not promises. Shared condition records and transparent
              deposit settlements for tenants and landlords.
            </p>
            <div className="text-[11px] text-[#94A3B8]/80 font-mono">
              Version 1.0 • Built with Next.js & Motion
            </div>
          </div>

          {/* Product Nav */}
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-4">Product</div>
            <ul className="space-y-2.5">
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#for-tenants" className="hover:text-white transition-colors">
                  For Tenants
                </a>
              </li>
              <li>
                <a href="#for-landlords" className="hover:text-white transition-colors">
                  For Landlords
                </a>
              </li>
              <li>
                <a href="#product-showcase" className="hover:text-white transition-colors">
                  Interactive Showcase
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Pricing Plans
                </a>
              </li>
            </ul>
          </div>

          {/* Application Links */}
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-4">Application</div>
            <ul className="space-y-2.5">
              <li>
                <Link href="/app" className="hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/app/properties/new" className="hover:text-white transition-colors">
                  Create Property Record
                </Link>
              </li>
              <li>
                <Link href="/app/properties/prop-skyline-14b/comparison" className="hover:text-white transition-colors">
                  Evidence Comparison Tool
                </Link>
              </li>
              <li>
                <Link href="/app/properties/prop-skyline-14b/settlement" className="hover:text-white transition-colors">
                  Settlement Ledger
                </Link>
              </li>
              <li>
                <Link href="/app/properties/prop-skyline-14b/report" className="hover:text-white transition-colors">
                  Export Condition Report
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-4">Trust & Legal</div>
            <ul className="space-y-2.5">
              <li>
                <Link href="/trust" className="hover:text-white transition-colors">
                  Trust & Security Architecture
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy & Evidence Retention
                </Link>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Disclaimer */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#94A3B8]">
          <p className="max-w-3xl leading-relaxed">
            <strong>Legal Notice:</strong> DepositGuard is an independent documentation and evidence
            management software platform. DepositGuard is not an escrow agent, financial institution,
            dispute tribunal, or legal representative. It does not hold funds, guarantee recovery, or
            make binding liability rulings.
          </p>
          <div className="whitespace-nowrap">
            © {currentYear} DepositGuard. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
