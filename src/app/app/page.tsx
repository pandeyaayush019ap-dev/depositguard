'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Building,
  PlusCircle,
  FileCheck2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Split,
  Eye,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { storage } from '@/lib/storage';
import { Property, Deduction, ActivityLog } from '@/lib/types';
import { calculateSettlement, formatINR } from '@/lib/settlementCalculator';

export default function DashboardPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [deductions, setDeductions] = useState<Deduction[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [currentUser, setCurrentUser] = useState(storage.getCurrentUser());

  useEffect(() => {
    const loadData = () => {
      setProperties(storage.getProperties());
      setDeductions(storage.getDeductions());
      setActivityLogs(storage.getActivityLogs());
      setCurrentUser(storage.getCurrentUser());
    };

    loadData();
    const unsubscribe = storage.subscribe(loadData);
    return () => unsubscribe();
  }, []);

  // Compute aggregate real metrics from active properties
  const totalDepositsDocumented = properties.reduce((acc, p) => acc + p.depositAmount, 0);
  const activeTenancies = properties.filter((p) => p.status !== 'settled').length;
  const settledTenancies = properties.filter((p) => p.status === 'settled').length;

  // Aggregate deductions from all properties
  let totalAgreedDeductions = 0;
  let totalDisputedAmount = 0;
  deductions.forEach((d) => {
    if (d.status === 'agreed') {
      totalAgreedDeductions += d.agreedAmount > 0 ? d.agreedAmount : d.proposedAmount;
    } else if (d.status === 'disputed') {
      totalDisputedAmount += d.proposedAmount;
    }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0C1B2B] via-[#102438] to-[#0C1B2B] border border-white/10 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#16C784]/20 text-[#9BF5CC] border border-[#16C784]/30">
              Active Persona: {currentUser.role.toUpperCase()}
            </span>
            <span className="text-xs text-[#94A3B8]">• {currentUser.email}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 max-w-xl">
            Here is your live rental deposit ledger, pending inspection signoffs, and settlement status
            across your properties.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/app/properties/new"
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#16C784] to-[#12A86E] text-[#07111F] font-bold text-sm shadow-lg hover:opacity-95 transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-[#07111F]" />
            <span>New Property Record</span>
          </Link>
        </div>
      </div>

      {/* Aggregate Real Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Deposits Tracked */}
        <div className="p-5 rounded-2xl bg-[#0C1B2B] border border-white/10">
          <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-2">
            <span>Total Deposits Tracked</span>
            <ShieldCheck className="w-4 h-4 text-[#16C784]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {formatINR(totalDepositsDocumented)}
          </div>
          <div className="text-[11px] text-[#94A3B8] mt-1">
            Across {properties.length} recorded tenancies
          </div>
        </div>

        {/* Active Tenancies */}
        <div className="p-5 rounded-2xl bg-[#0C1B2B] border border-white/10">
          <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-2">
            <span>Active Tenancies</span>
            <Building className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {activeTenancies}
          </div>
          <div className="text-[11px] text-[#94A3B8] mt-1">
            {settledTenancies} historical record archived
          </div>
        </div>

        {/* Agreed Deductions */}
        <div className="p-5 rounded-2xl bg-[#0C1B2B] border border-white/10">
          <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-2">
            <span>Agreed Deductions</span>
            <CheckCircle2 className="w-4 h-4 text-[#16C784]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
            {formatINR(totalAgreedDeductions)}
          </div>
          <div className="text-[11px] text-[#94A3B8] mt-1">Mutually approved repair costs</div>
        </div>

        {/* Disputed Amounts */}
        <div className="p-5 rounded-2xl bg-[#0C1B2B] border border-white/10">
          <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-2">
            <span>Items Under Dispute</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">
            {formatINR(totalDisputedAmount)}
          </div>
          <div className="text-[11px] text-[#94A3B8] mt-1">Awaiting mediation or agreement</div>
        </div>
      </div>

      {/* Main Properties Section */}
      <div className="rounded-3xl bg-[#0C1B2B] border border-white/10 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Your Rental Properties</h2>
            <p className="text-xs text-[#94A3B8]">
              Manage move-in baselines, compare exit evidence, and inspect settlement ledgers.
            </p>
          </div>
          <Link
            href="/app/properties/new"
            className="text-xs font-semibold text-[#16C784] hover:underline flex items-center gap-1"
          >
            <span>+ Add new property</span>
          </Link>
        </div>

        <div className="space-y-4">
          {properties.map((prop) => {
            const propDeductions = deductions.filter((d) => d.propertyId === prop.id);
            const settlement = calculateSettlement(
              prop.depositAmount,
              propDeductions,
              prop.termsAgreed.landlordSignedAt !== undefined,
              prop.termsAgreed.tenantSignedAt !== undefined
            );

            return (
              <div
                key={prop.id}
                className="p-5 sm:p-6 rounded-2xl bg-[#102438]/80 hover:bg-[#102438] border border-white/5 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                {/* Left Info */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      {prop.title}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        prop.status === 'settlement_in_progress'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : prop.status === 'settled'
                          ? 'bg-[#16C784]/20 text-[#9BF5CC] border border-[#16C784]/30'
                          : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      }`}
                    >
                      {prop.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-[#94A3B8]">{prop.address}, {prop.city} {prop.postalCode}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#F7FAFC]/80 pt-2">
                    <div>
                      <span className="text-[#94A3B8]">Deposit:</span>{' '}
                      <strong className="text-white font-bold">{formatINR(prop.depositAmount)}</strong>
                    </div>
                    <div>
                      <span className="text-[#94A3B8]">Monthly Rent:</span>{' '}
                      <span className="text-white">{formatINR(prop.monthlyRent)}</span>
                    </div>
                    <div>
                      <span className="text-[#94A3B8]">Tenant:</span>{' '}
                      <span className="text-white">{prop.tenantName || 'Pending Invite'}</span>
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                  <Link
                    href={`/app/properties/${prop.id}/comparison`}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Split className="w-3.5 h-3.5 text-[#16C784]" />
                    <span>Compare Evidence</span>
                  </Link>

                  <Link
                    href={`/app/properties/${prop.id}/settlement`}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#16C784]/15 hover:bg-[#16C784]/25 border border-[#16C784]/30 text-xs font-bold text-[#9BF5CC] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-[#16C784]" />
                    <span>Settlement Ledger</span>
                  </Link>

                  <Link
                    href={`/app/properties/${prop.id}`}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors"
                    title="View Property Details"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Timeline Section */}
      <div className="rounded-3xl bg-[#0C1B2B] border border-white/10 p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#16C784]" />
            <h2 className="text-lg font-bold text-white tracking-tight">Recent Audit Activity</h2>
          </div>
          <Link
            href="/app/notifications"
            className="text-xs font-semibold text-[#16C784] hover:underline"
          >
            View full log
          </Link>
        </div>

        <div className="space-y-3">
          {activityLogs.slice(0, 4).map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-xl bg-[#102438]/60 border border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#16C784]" />
                <div>
                  <span className="font-bold text-white">{log.action}</span>: {log.details}
                </div>
              </div>
              <div className="text-[11px] font-mono text-[#94A3B8]">
                {new Date(log.timestamp).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
