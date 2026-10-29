'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  PlusCircle,
  FileText,
  DollarSign,
  Tag,
  Clock,
  ThumbsUp,
  ThumbsDown,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import { storage } from '@/lib/storage';
import { Property, Deduction } from '@/lib/types';
import { calculateSettlement, formatINR } from '@/lib/settlementCalculator';
import SettlementSummaryCard from '@/components/app/SettlementSummaryCard';
import Modal from '@/components/ui/Modal';
import confetti from 'canvas-confetti';

export default function SettlementLedgerPage() {
  const params = useParams();
  const propertyId = params?.id as string;

  const [property, setProperty] = useState<Property | undefined>(undefined);
  const [deductions, setDeductions] = useState<Deduction[]>([]);
  const [currentUser, setCurrentUser] = useState(storage.getCurrentUser());

  // Modal for new deduction
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'cleaning' | 'repair' | 'painting' | 'replacement'>('cleaning');
  const [proposedAmount, setProposedAmount] = useState('3000');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const load = () => {
      setProperty(storage.getPropertyById(propertyId));
      setDeductions(storage.getPropertyDeductions(propertyId));
      setCurrentUser(storage.getCurrentUser());
    };

    load();
    const unsub = storage.subscribe(load);
    return () => unsub();
  }, [propertyId]);

  if (!property) return null;

  const handleStatusChange = (
    deduction: Deduction,
    newStatus: 'agreed' | 'disputed' | 'waived'
  ) => {
    const updated: Deduction = {
      ...deduction,
      status: newStatus,
      agreedAmount: newStatus === 'agreed' ? deduction.proposedAmount : 0,
      tenantComment:
        currentUser.role === 'tenant'
          ? `Tenant marked as ${newStatus}`
          : deduction.tenantComment,
      landlordComment:
        currentUser.role === 'landlord'
          ? `Landlord marked as ${newStatus}`
          : deduction.landlordComment,
      updatedAt: new Date().toISOString(),
    };

    storage.saveDeduction(updated);
  };

  const handleCreateDeduction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !proposedAmount) return;

    storage.saveDeduction({
      id: `ded-${Date.now()}`,
      propertyId,
      title,
      category,
      proposedAmount: Number(proposedAmount) || 0,
      agreedAmount: 0,
      status: 'pending',
      proposedByRole: currentUser.role,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    setIsModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const handleMutualSignoff = () => {
    storage.saveProperty({
      ...property,
      termsAgreed: {
        ...property.termsAgreed,
        landlordSignedAt: new Date().toISOString(),
        tenantSignedAt: new Date().toISOString(),
      },
      status: 'settled',
    });
    alert('Both parties have recorded mutual settlement acknowledgment! Final clearance saved.');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link
            href={`/app/properties/${propertyId}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#16C784] hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {property.title}
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Deposit Settlement Ledger
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Itemized breakdown of proposed deductions, disputed amounts, and final refundable balance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/app/properties/${propertyId}/report`}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-4 h-4 text-[#16C784]" />
            <span>Generate Report PDF</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#16C784] text-[#07111F] font-bold text-xs shadow flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Propose Deduction</span>
          </button>
        </div>
      </div>

      {/* Main Ledger Card */}
      <SettlementSummaryCard
        depositAmount={property.depositAmount}
        deductions={deductions}
        landlordAcknowledged={property.termsAgreed.landlordSignedAt !== undefined}
        tenantAcknowledged={property.termsAgreed.tenantSignedAt !== undefined}
        onMutualSignoff={handleMutualSignoff}
        userRole={currentUser.role}
      />

      {/* Itemized Deduction Entries */}
      <div className="rounded-3xl bg-[#0C1B2B] border border-white/10 p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white tracking-tight">
            Itemized Deductions ({deductions.length})
          </h3>
          <span className="text-xs text-[#94A3B8]">Review and acknowledge individual line items</span>
        </div>

        {deductions.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[#07111F] text-xs text-[#94A3B8]">
            No deductions proposed yet. Full deposit of {formatINR(property.depositAmount)} is
            eligible for 100% refund.
          </div>
        ) : (
          <div className="space-y-4">
            {deductions.map((ded) => (
              <div
                key={ded.id}
                className="p-5 rounded-2xl bg-[#102438] border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                {/* Left Description */}
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        ded.status === 'agreed'
                          ? 'bg-[#16C784]/20 text-[#9BF5CC]'
                          : ded.status === 'disputed'
                          ? 'bg-amber-500/20 text-amber-300'
                          : ded.status === 'waived'
                          ? 'bg-white/10 text-[#94A3B8]'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {ded.status}
                    </span>
                    <span className="text-xs font-semibold text-[#94A3B8] uppercase">
                      Category: {ded.category}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white tracking-tight">{ded.title}</h4>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">{ded.description}</p>

                  {ded.tenantComment && (
                    <div className="text-[11px] text-[#9BF5CC] bg-[#07111F]/60 p-2 rounded-lg border border-white/5">
                      <strong>Tenant Note:</strong> {ded.tenantComment}
                    </div>
                  )}

                  {ded.landlordComment && (
                    <div className="text-[11px] text-sky-300 bg-[#07111F]/60 p-2 rounded-lg border border-white/5">
                      <strong>Landlord Note:</strong> {ded.landlordComment}
                    </div>
                  )}
                </div>

                {/* Right Amounts & Actions */}
                <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                  <div className="text-left md:text-right">
                    <div className="text-xl font-black text-white">{formatINR(ded.proposedAmount)}</div>
                    <div className="text-[11px] text-[#94A3B8]">
                      Agreed: {formatINR(ded.agreedAmount)}
                    </div>
                  </div>

                  {/* Action Buttons to Agree / Dispute / Waive */}
                  <div className="flex items-center gap-2">
                    {ded.status !== 'agreed' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(ded, 'agreed')}
                        className="px-3 py-1.5 rounded-lg bg-[#16C784]/15 hover:bg-[#16C784]/25 text-[#9BF5CC] border border-[#16C784]/30 text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Agree</span>
                      </button>
                    )}

                    {ded.status !== 'disputed' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(ded, 'disputed')}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                        <span>Dispute</span>
                      </button>
                    )}

                    {ded.status !== 'waived' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(ded, 'waived')}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#94A3B8] text-xs font-medium transition-colors"
                      >
                        <span>Waive</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Deduction Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Propose Deposit Deduction"
        description="Add a repair or cleaning line item for mutual review."
      >
        <form onSubmit={handleCreateDeduction} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/90 mb-1">Deduction Title</label>
            <input
              type="text"
              placeholder="e.g. Broken bathroom towel rod or kitchen deep clean"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#16C784]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-2 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#16C784]"
              >
                <option value="cleaning">Cleaning</option>
                <option value="repair">Repair</option>
                <option value="painting">Painting</option>
                <option value="replacement">Replacement</option>
                <option value="unpaid_utility">Unpaid Utility</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/90 mb-1">Amount (₹)</label>
              <input
                type="number"
                value={proposedAmount}
                onChange={(e) => setProposedAmount(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#16C784]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/90 mb-1">
              Description / Contractor Quote
            </label>
            <textarea
              rows={3}
              placeholder="Explain why this cost was incurred and reference any invoices..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#16C784]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/5 text-xs font-semibold text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#16C784] text-[#07111F] text-xs font-bold shadow"
            >
              Add Proposed Deduction
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
