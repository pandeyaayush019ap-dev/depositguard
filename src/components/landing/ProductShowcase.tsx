'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Layers,
  Calculator,
  Split,
  Camera,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Info,
  ArrowRight,
} from 'lucide-react';
import BeforeAfterSlider from '@/components/app/BeforeAfterSlider';
import SettlementSummaryCard from '@/components/app/SettlementSummaryCard';
import { INITIAL_DEDUCTIONS } from '@/lib/mockData';

export default function ProductShowcase() {
  const [activeTab, setActiveTab] = useState<'settlement' | 'comparison' | 'inspection' | 'terms'>('settlement');

  return (
    <section id="product-showcase" className="py-20 lg:py-28 bg-[#07111F] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#102438] border border-white/10 text-xs font-semibold text-[#9BF5CC] mb-4">
            <Layers className="w-3.5 h-3.5 text-[#16C784]" />
            Live Product Interface Preview
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Designed for total financial clarity.
          </h2>
          <p className="text-base sm:text-lg text-[#94A3B8] mt-3">
            Interact with the actual platform interface below. Everything is grounded in verifiable
            evidence and transparent decimal calculations.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-amber-300/90 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>Illustrative Product Example: Skyline Heights Apt 14B sample record</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('settlement')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'settlement'
                ? 'bg-[#16C784] text-[#07111F] shadow-lg shadow-[#16C784]/20'
                : 'bg-[#0C1B2B] text-[#94A3B8] hover:text-white border border-white/5'
            }`}
          >
            <Calculator className="w-4 h-4" />
            Settlement Ledger & Refund
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('comparison')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'comparison'
                ? 'bg-[#16C784] text-[#07111F] shadow-lg shadow-[#16C784]/20'
                : 'bg-[#0C1B2B] text-[#94A3B8] hover:text-white border border-white/5'
            }`}
          >
            <Split className="w-4 h-4" />
            Split Photo Comparison
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inspection')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'inspection'
                ? 'bg-[#16C784] text-[#07111F] shadow-lg shadow-[#16C784]/20'
                : 'bg-[#0C1B2B] text-[#94A3B8] hover:text-white border border-white/5'
            }`}
          >
            <Camera className="w-4 h-4" />
            Move-In Checklist
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'terms'
                ? 'bg-[#16C784] text-[#07111F] shadow-lg shadow-[#16C784]/20'
                : 'bg-[#0C1B2B] text-[#94A3B8] hover:text-white border border-white/5'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            Agreed Tenancy Clauses
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="max-w-5xl mx-auto">
          {activeTab === 'settlement' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <SettlementSummaryCard
                depositAmount={120000}
                deductions={INITIAL_DEDUCTIONS}
                landlordAcknowledged={true}
                tenantAcknowledged={false}
              />

              {/* Deductions Breakdown Table */}
              <div className="rounded-2xl bg-[#0C1B2B] border border-white/10 p-6">
                <h4 className="text-base font-bold text-white mb-4">Itemized Deduction Ledger</h4>
                <div className="space-y-3">
                  {INITIAL_DEDUCTIONS.map((ded) => (
                    <div
                      key={ded.id}
                      className="p-4 rounded-xl bg-[#102438] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              ded.status === 'agreed'
                                ? 'bg-[#16C784]/20 text-[#9BF5CC]'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {ded.status}
                          </span>
                          <span className="text-sm font-bold text-white">{ded.title}</span>
                        </div>
                        <p className="text-xs text-[#94A3B8] mt-1">{ded.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-black text-white">
                          ₹{ded.proposedAmount.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[11px] text-[#94A3B8]">
                          Agreed: ₹{ded.agreedAmount.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'comparison' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <BeforeAfterSlider
                beforeImage="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80"
                afterImage="https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80"
                beforeLabel="Move-In Baseline"
                afterLabel="Move-Out Walkthrough"
                beforeDate="Nov 1, 2025"
                afterDate="Oct 27, 2026"
                itemName="Faber Exhaust Chimney & Hob Mesh"
                roomName="Kitchen"
                conditionBefore="Pristine"
                conditionAfter="Fair"
                notesBefore="Filters professionally degreased. Both halogen lights and fan speeds operational."
                notesAfter="Heavy oil grime accumulation on baffle filters. Requires standard degreasing service."
                defectTags={['grease-accumulation', 'cleaning-deduction-agreed']}
                discrepancyNote="Tenant and landlord agreed to ₹2,500 professional deep-degreasing service."
              />
            </motion.div>
          )}

          {activeTab === 'inspection' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl bg-[#0C1B2B] border border-white/10 p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h4 className="text-base font-bold text-white">Move-In Baseline Checklist</h4>
                  <p className="text-xs text-[#94A3B8]">
                    Recorded by Priya Sharma & Arjun Mehta on Nov 1, 2025
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#16C784]/20 text-[#9BF5CC]">
                  5/5 Rooms Signed
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { room: 'Living Room', items: '4 items checked', state: 'Good condition' },
                  { room: 'Kitchen', items: '6 items checked', state: 'Pristine baseline' },
                  { room: 'Master Bedroom', items: '5 items checked', state: 'Pristine baseline' },
                  { room: 'Master Bathroom', items: '3 items checked', state: 'Good condition' },
                ].map((r, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#102438] border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-white">{r.room}</div>
                      <div className="text-xs text-[#94A3B8]">{r.items}</div>
                    </div>
                    <span className="text-xs font-medium text-[#16C784] bg-[#16C784]/10 px-2.5 py-1 rounded-md">
                      {r.state}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'terms' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl bg-[#0C1B2B] border border-white/10 p-6 space-y-4"
            >
              <h4 className="text-base font-bold text-white mb-2">Agreed Tenancy Parameters</h4>
              <div className="space-y-3">
                {[
                  {
                    title: 'Fair Wear & Tear Definition',
                    desc: 'Small pinholes from picture frames, minor floor scuffs from furniture, and natural paint fading over 12+ months cannot be deducted.',
                    status: 'Mutually Acknowledged',
                  },
                  {
                    title: 'Move-In Defect Grace Period',
                    desc: 'Tenant had 7 business days post move-in to append undiscovered electrical or plumbing faults without landlord liability challenge.',
                    status: 'Mutually Acknowledged',
                  },
                  {
                    title: 'Professional Deep Cleaning Standard',
                    desc: 'Property must be returned in swept-clean condition. Kitchen chimney degreasing is payable if not serviced by tenant upon exit.',
                    status: 'Mutually Acknowledged',
                  },
                ].map((clause, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#102438] border border-white/5 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-bold text-white">{clause.title}</div>
                      <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">{clause.desc}</p>
                    </div>
                    <span className="text-xs font-bold text-[#16C784] shrink-0 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      {clause.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
