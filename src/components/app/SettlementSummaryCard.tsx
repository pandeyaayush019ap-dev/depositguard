'use client';

import React from 'react';
import { Deduction } from '@/lib/types';
import { calculateSettlement, formatINR } from '@/lib/settlementCalculator';
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  CheckCircle2,
  Info,
  Clock,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SettlementSummaryCardProps {
  depositAmount: number;
  deductions: Deduction[];
  landlordAcknowledged: boolean;
  tenantAcknowledged: boolean;
  onMutualSignoff?: () => void;
  userRole?: string;
}

export default function SettlementSummaryCard({
  depositAmount,
  deductions,
  landlordAcknowledged,
  tenantAcknowledged,
  onMutualSignoff,
  userRole = 'tenant',
}: SettlementSummaryCardProps) {
  const summary = calculateSettlement(
    depositAmount,
    deductions,
    landlordAcknowledged,
    tenantAcknowledged
  );

  const handleSignoffClick = () => {
    if (onMutualSignoff) {
      onMutualSignoff();
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#16C784', '#9BF5CC', '#F7FAFC'],
        });
      } catch {
        // no-op
      }
    }
  };

  const getStatusBadge = () => {
    switch (summary.settlementStatus) {
      case 'mutually_agreed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16C784]/20 text-[#9BF5CC] border border-[#16C784]/40 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-[#16C784]" />
            Mutually Agreed & Signed
          </span>
        );
      case 'disputed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Items Under Dispute
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-bold">
            <Clock className="w-4 h-4 text-blue-400" />
            Deductions In Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/80 border border-white/20 text-xs font-medium">
            Pending Move-Out Inspection
          </span>
        );
    }
  };

  return (
    <div className="rounded-3xl bg-[#0C1B2B] border border-white/10 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-white/10 bg-gradient-to-r from-[#102438] to-[#0C1B2B] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-[#16C784]" />
            <h3 className="text-lg font-bold text-white tracking-tight">Deposit Settlement Ledger</h3>
          </div>
          <p className="text-xs text-[#94A3B8]">
            Immutable record of agreed deductions, disputed items, and refundable balance.
          </p>
        </div>
        <div>{getStatusBadge()}</div>
      </div>

      {/* Grid of Balances */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#07111F]/50">
        {/* Original Deposit */}
        <div className="p-4 rounded-2xl bg-[#0C1B2B] border border-white/5">
          <div className="text-xs font-medium text-[#94A3B8]">Original Security Deposit</div>
          <div className="text-2xl font-bold text-white tracking-tight mt-1">
            {formatINR(summary.originalDeposit)}
          </div>
          <div className="text-[11px] text-[#94A3B8] mt-1">Recorded in rental agreement</div>
        </div>

        {/* Agreed Deductions */}
        <div className="p-4 rounded-2xl bg-[#0C1B2B] border border-white/5">
          <div className="text-xs font-medium text-emerald-400">Mutually Agreed Deductions</div>
          <div className="text-2xl font-bold text-emerald-400 tracking-tight mt-1">
            - {formatINR(summary.totalAgreedDeductions)}
          </div>
          <div className="text-[11px] text-[#94A3B8] mt-1">
            {deductions.filter((d) => d.status === 'agreed').length} acknowledged items
          </div>
        </div>

        {/* Disputed Deductions */}
        <div className="p-4 rounded-2xl bg-[#0C1B2B] border border-white/5">
          <div className="text-xs font-medium text-amber-400">Currently Disputed</div>
          <div className="text-2xl font-bold text-amber-400 tracking-tight mt-1">
            {formatINR(summary.totalDisputedAmount)}
          </div>
          <div className="text-[11px] text-[#94A3B8] mt-1">Not deducted from balance</div>
        </div>

        {/* Net Refund Balance */}
        <div className="p-4 rounded-2xl bg-[#102438] border border-[#16C784]/30 glow-emerald">
          <div className="text-xs font-bold text-[#9BF5CC] uppercase tracking-wider">
            Refundable Balance
          </div>
          <div className="text-3xl font-black text-white tracking-tight mt-1">
            {formatINR(summary.finalRefundBalance)}
          </div>
          <div className="text-[11px] text-[#9BF5CC] mt-1 font-medium">
            Pending final landlord disbursement
          </div>
        </div>
      </div>

      {/* Acknowledgment Status Bar */}
      <div className="p-6 border-t border-white/10 bg-[#0C1B2B] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                tenantAcknowledged ? 'bg-[#16C784]' : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span className="text-xs font-medium text-[#F7FAFC]">
              Tenant Signoff: {tenantAcknowledged ? 'Confirmed' : 'Pending Signature'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                landlordAcknowledged ? 'bg-[#16C784]' : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span className="text-xs font-medium text-[#F7FAFC]">
              Landlord Signoff: {landlordAcknowledged ? 'Confirmed' : 'Pending Signature'}
            </span>
          </div>
        </div>

        {onMutualSignoff && (
          <button
            type="button"
            onClick={handleSignoffClick}
            className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#16C784] to-[#12A86E] text-[#07111F] font-bold text-sm hover:opacity-95 transition-opacity shadow-lg flex items-center justify-center gap-2"
          >
            <FileCheck2 className="w-4 h-4 text-[#07111F]" />
            Sign Settlement Acknowledgment
          </button>
        )}
      </div>

      {/* Trust & Boundary Notice */}
      <div className="p-4 bg-[#07111F] border-t border-white/5 flex items-start gap-2.5 text-xs text-[#94A3B8]">
        <Info className="w-4 h-4 text-[#94A3B8] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Important Notice:</strong> DepositGuard calculates acknowledged settlement balances
          and creates an auditable record of agreement. DepositGuard is a documentation platform; it does
          not hold security deposits in escrow or execute automated banking payouts. Actual refund
          disbursements are transferred directly between tenant and landlord via agreed banking channels.
        </p>
      </div>
    </div>
  );
}
