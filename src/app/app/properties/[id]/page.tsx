'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Building,
  ShieldCheck,
  Calendar,
  User,
  Share2,
  Copy,
  Check,
  Camera,
  Split,
  FileCheck2,
  FileText,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { storage } from '@/lib/storage';
import { Property, Inspection, Deduction, ActivityLog } from '@/lib/types';
import { calculateSettlement, formatINR } from '@/lib/settlementCalculator';
import SettlementSummaryCard from '@/components/app/SettlementSummaryCard';
import ActivityTimeline from '@/components/app/ActivityTimeline';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params?.id as string;

  const [property, setProperty] = useState<Property | undefined>(undefined);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [deductions, setDeductions] = useState<Deduction[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = () => {
      const p = storage.getPropertyById(propertyId);
      setProperty(p);
      setInspections(storage.getPropertyInspections(propertyId));
      setDeductions(storage.getPropertyDeductions(propertyId));
      setLogs(storage.getActivityLogs(propertyId));
    };

    load();
    const unsub = storage.subscribe(load);
    return () => unsub();
  }, [propertyId]);

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <Building className="w-12 h-12 text-[#94A3B8] mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Property Not Found</h2>
        <p className="text-xs text-[#94A3B8] mb-6">
          The requested rental record does not exist or has been removed.
        </p>
        <Link
          href="/app/properties"
          className="px-4 py-2 rounded-xl bg-[#16C784] text-[#07111F] font-bold text-xs"
        >
          Return to Properties
        </Link>
      </div>
    );
  }

  const moveInInspection = inspections.find((i) => i.type === 'move_in');
  const moveOutInspection = inspections.find((i) => i.type === 'move_out');

  const copyInvite = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/app/properties/${property.id}?invite=${property.inviteCode}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/app/properties"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#16C784] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Properties
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`/app/properties/${property.id}/report`}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-[#16C784]" />
            <span>Export Official PDF Report</span>
          </Link>
        </div>
      </div>

      {/* Property Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0C1B2B] border border-white/10 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                property.status === 'settlement_in_progress'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : property.status === 'settled'
                  ? 'bg-[#16C784]/20 text-[#9BF5CC] border border-[#16C784]/30'
                  : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
              }`}
            >
              {property.status.replace(/_/g, ' ')}
            </span>
            <span className="text-xs text-[#94A3B8] font-mono">Code: {property.inviteCode}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {property.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            {property.address}, {property.city} {property.postalCode}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-3 text-xs text-[#F7FAFC]/80">
            <div>
              <span className="text-[#94A3B8]">Deposit:</span>{' '}
              <strong className="text-white font-bold">{formatINR(property.depositAmount)}</strong>
            </div>
            <div>
              <span className="text-[#94A3B8]">Monthly Rent:</span>{' '}
              <span className="text-white">{formatINR(property.monthlyRent)}</span>
            </div>
            <div>
              <span className="text-[#94A3B8]">Lease Period:</span>{' '}
              <span className="text-white">
                {property.leaseStartDate} to {property.leaseEndDate}
              </span>
            </div>
          </div>
        </div>

        {/* Counterpart Invite Card */}
        <div className="p-4 rounded-2xl bg-[#102438] border border-white/5 w-full lg:w-80 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white">Counterpart Access</span>
            <span className="text-[10px] text-[#16C784] font-semibold">Active</span>
          </div>
          <div className="text-xs text-[#94A3B8] mb-3">
            {property.tenantName ? (
              <div>
                Tenant: <strong className="text-white">{property.tenantName}</strong> (
                {property.tenantEmail})
              </div>
            ) : (
              <div>No tenant attached yet. Send invite code to connect.</div>
            )}
          </div>
          <button
            type="button"
            onClick={copyInvite}
            className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#16C784]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Invite Link Copied!' : 'Copy Shareable Invite Link'}</span>
          </button>
        </div>
      </div>

      {/* 4 Feature Modules Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Move-In Inspection */}
        <Link
          href={`/app/properties/${property.id}/inspection?type=move_in`}
          className="p-5 rounded-2xl bg-[#0C1B2B] hover:bg-[#102438] border border-white/10 hover:border-[#16C784]/40 transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#16C784]/15 text-[#16C784] flex items-center justify-center mb-3">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">Move-In Inspection</h3>
            <p className="text-xs text-[#94A3B8] mt-1">
              Baseline photos, initial defects, and utility meters.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 text-xs font-bold text-[#16C784] flex items-center gap-1">
            <span>{moveInInspection ? 'View 5 Room Records' : 'Start Walkthrough'}</span>
            <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
          </div>
        </Link>

        {/* Move-Out Inspection */}
        <Link
          href={`/app/properties/${property.id}/inspection?type=move_out`}
          className="p-5 rounded-2xl bg-[#0C1B2B] hover:bg-[#102438] border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-3">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">Move-Out Walkthrough</h3>
            <p className="text-xs text-[#94A3B8] mt-1">
              Document final condition, keys, and final meter readings.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 text-xs font-bold text-amber-400 flex items-center gap-1">
            <span>{moveOutInspection ? 'Review Exit Record' : 'Record Exit'}</span>
            <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
          </div>
        </Link>

        {/* Split Photo Comparison */}
        <Link
          href={`/app/properties/${property.id}/comparison`}
          className="p-5 rounded-2xl bg-[#0C1B2B] hover:bg-[#102438] border border-white/10 hover:border-[#16C784]/40 transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#16C784]/15 text-[#16C784] flex items-center justify-center mb-3">
              <Split className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">Evidence Comparison</h3>
            <p className="text-xs text-[#94A3B8] mt-1">
              Side-by-side photographic delta slider across rooms.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 text-xs font-bold text-[#16C784] flex items-center gap-1">
            <span>Open Split Comparison</span>
            <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
          </div>
        </Link>

        {/* Settlement Ledger */}
        <Link
          href={`/app/properties/${property.id}/settlement`}
          className="p-5 rounded-2xl bg-[#0C1B2B] hover:bg-[#102438] border border-white/10 hover:border-[#16C784]/40 transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center mb-3">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">Settlement Ledger</h3>
            <p className="text-xs text-[#94A3B8] mt-1">
              Agreed deductions, disputes, and refund balance.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 text-xs font-bold text-sky-400 flex items-center gap-1">
            <span>Inspect Settlement</span>
            <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
          </div>
        </Link>
      </div>

      {/* Live Settlement Summary Card */}
      <SettlementSummaryCard
        depositAmount={property.depositAmount}
        deductions={deductions}
        landlordAcknowledged={property.termsAgreed.landlordSignedAt !== undefined}
        tenantAcknowledged={property.termsAgreed.tenantSignedAt !== undefined}
        onMutualSignoff={() => {
          storage.saveProperty({
            ...property,
            termsAgreed: {
              ...property.termsAgreed,
              landlordSignedAt: new Date().toISOString(),
              tenantSignedAt: new Date().toISOString(),
            },
            status: 'settled',
          });
          alert('Mutual settlement acknowledgment signed! Settlement recorded.');
        }}
      />

      {/* Tenancy Audit Trail */}
      <ActivityTimeline logs={logs} />
    </div>
  );
}
