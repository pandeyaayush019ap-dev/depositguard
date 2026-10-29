'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';

export default function Faq() {
  const faqs = [
    {
      question: 'What is DepositGuard?',
      answer:
        'DepositGuard is an evidence documentation and settlement-tracking platform for rental security deposits. It gives tenants and landlords a neutral, shared digital ledger to record property baseline condition at move-in, compare changes at move-out, and calculate acknowledged deduction balances with mutual electronic signoff.',
    },
    {
      question: 'Does DepositGuard hold my security deposit in escrow?',
      answer:
        'No. DepositGuard is strictly an evidence documentation and settlement platform. We do not operate as an escrow bank, regulated deposit holder, or payment intermediary. Actual security deposits and refund transfers remain directly between tenant and landlord via mutually agreed banking methods (NEFT, RTGS, UPI, or cheque).',
    },
    {
      question: 'Can both tenants and landlords use DepositGuard?',
      answer:
        'Yes! Either party can initiate a rental record. Once initiated, the creator generates a secure invitation link or code for the other party. Both tenant and landlord have full visibility and mutual signoff capabilities on inspections, terms, and deduction ledgers.',
    },
    {
      question: 'How are move-in and move-out records compared?',
      answer:
        'During move-in, high-resolution photographs and condition ratings are logged for each room and fixture. At move-out, corresponding photographs are taken from identical angles. Our split-screen comparison slider allows both parties to inspect physical changes side-by-side and distinguish normal wear-and-tear from confirmed new damage.',
    },
    {
      question: 'Does DepositGuard guarantee a 100% refund of my deposit?',
      answer:
        'No platform can guarantee legal outcomes. DepositGuard eliminates subjective disputes by ensuring undeniable photographic evidence and mutual agreement on wear-and-tear definitions exist from day one. If a landlord attempts an unjustified deduction, the tenant has timestamped proof to challenge it.',
    },
    {
      question: 'What happens when a deduction is disputed?',
      answer:
        'When a proposed deduction is marked as "Disputed", our settlement calculator isolates that specific amount. The undisputed remainder of the refund balance can be agreed upon and released, while both parties discuss the disputed line item using attached receipts and original inspection records.',
    },
    {
      question: 'Who can access my rental property records?',
      answer:
        'Only authorised participants (the invited tenant, verified landlord, and designated property manager) have access to the property file and inspection photographs. Records are not publicly accessible or indexed by search engines.',
    },
    {
      question: 'How much does DepositGuard cost?',
      answer:
        'Our proposed commercial plan for individual renters is a one-time fee of ₹499 per tenancy, covering full move-in/out documentation and evidence storage. During our launch preview, all features in the interactive application are accessible for testing.',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 lg:py-28 bg-[#07111F] border-t border-white/5 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#102438] border border-white/10 text-xs font-semibold text-[#9BF5CC] mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-[#16C784]" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Clear answers to important questions.
          </h2>
          <p className="text-base sm:text-lg text-[#94A3B8] mt-3">
            Honest answers reflecting exactly how the platform works and its legal boundaries.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#0C1B2B] border border-white/10 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16C784]"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#16C784]' : 'text-[#94A3B8]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#94A3B8] leading-relaxed border-t border-white/5">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
