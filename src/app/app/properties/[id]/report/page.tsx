'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building,
  User,
  Zap,
  Droplet,
  Flame,
} from 'lucide-react';
import { storage } from '@/lib/storage';
import { Property, Inspection, Deduction } from '@/lib/types';
import { calculateSettlement, formatINR } from '@/lib/settlementCalculator';

export default function PropertyReportPage() {
  const params = useParams();
  const propertyId = params?.id as string;

  const [property, setProperty] = useState<Property | undefined>(undefined);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [deductions, setDeductions] = useState<Deduction[]>([]);

  useEffect(() => {
    setProperty(storage.getPropertyById(propertyId));
    setInspections(storage.getPropertyInspections(propertyId));
    setDeductions(storage.getPropertyDeductions(propertyId));
  }, [propertyId]);

  if (!property) return null;

  const moveIn = inspections.find((i) => i.type === 'move_in');
  const moveOut = inspections.find((i) => i.type === 'move_out');
  const summary = calculateSettlement(
    property.depositAmount,
    deductions,
    property.termsAgreed.landlordSignedAt !== undefined,
    property.termsAgreed.tenantSignedAt !== undefined
  );

  const handlePrint = () => {
    window.print();
  };

  const certificateId = `DG-CERT-${property.id.toUpperCase()}-${Math.random()
    .toString(36)
    .substring(2, 7)
    .toUpperCase()}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Non-printed Navigation Bar */}
      <div className="flex items-center justify-between gap-4 print:hidden">
        <Link
          href={`/app/properties/${propertyId}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#16C784] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Property Overview
        </Link>

        <button
          type="button"
          onClick={handlePrint}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#16C784] to-[#12A86E] text-[#07111F] font-bold text-xs sm:text-sm shadow flex items-center gap-2 hover:opacity-95"
        >
          <Printer className="w-4 h-4 text-[#07111F]" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Official Certificate Paper Container */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white text-slate-900 shadow-2xl border border-slate-200 print:shadow-none print:border-none print:p-0">
        {/* Certificate Header */}
        <div className="flex flex-wrap items-start justify-between border-b-2 border-slate-900 pb-6 mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#07111F] flex items-center justify-center text-[#16C784]">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                Deposit<span className="text-[#16C784]">Guard</span>
              </h1>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Certified Property Condition & Settlement Report
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-bold text-slate-900 font-mono">{certificateId}</div>
            <div className="text-[11px] text-slate-500">
              Generated: {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}
            </div>
          </div>
        </div>

        {/* Property & Parties Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-200 mb-8 text-xs">
          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Rental Property
            </span>
            <strong className="text-slate-900 text-sm block font-bold">{property.title}</strong>
            <span className="text-slate-600 block mt-0.5">
              {property.address}, {property.city}
            </span>
            <span className="text-slate-500 block font-mono text-[10px]">
              Invite Code: {property.inviteCode}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Parties
            </span>
            <div className="text-slate-700">
              Landlord: <strong className="text-slate-900">{property.landlordName}</strong>
            </div>
            <div className="text-slate-700">
              Tenant: <strong className="text-slate-900">{property.tenantName || 'Pending'}</strong>
            </div>
          </div>

          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Lease & Financials
            </span>
            <div className="text-slate-700">
              Duration: {property.leaseStartDate} to {property.leaseEndDate}
            </div>
            <div className="text-slate-700">
              Deposit: <strong>{formatINR(property.depositAmount)}</strong>
            </div>
          </div>
        </div>

        {/* Utility Meter Readings Section */}
        {moveIn?.meterReadings && (
          <div className="mb-8">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
              1. Certified Meter Readings
            </h2>
            <div className="grid grid-cols-3 gap-4 p-4 rounded-xl border border-slate-200 bg-white text-xs">
              <div>
                <span className="text-slate-500 block">Electricity (kWh)</span>
                <strong className="text-base font-bold text-slate-900">
                  {moveIn.meterReadings.electricityKwh || 'N/A'} kWh
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">Water Meter (kL)</span>
                <strong className="text-base font-bold text-slate-900">
                  {moveIn.meterReadings.waterMeterKl || 'N/A'} kL
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">Piped Gas (Units)</span>
                <strong className="text-base font-bold text-slate-900">
                  {moveIn.meterReadings.gasMeterUnits || 'N/A'} Units
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* Move-In Inspection Checklist Summary */}
        <div className="mb-8">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
            2. Room-by-Room Condition Summary
          </h2>
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Room / Fixture</th>
                <th className="p-3">Move-In Baseline</th>
                <th className="p-3">Move-Out Status</th>
                <th className="p-3">Inspection Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {(moveIn?.items || []).map((item) => (
                <tr key={item.id}>
                  <td className="p-3 font-semibold text-slate-900">
                    {item.name}
                    <div className="text-[10px] text-slate-500">{item.roomName}</div>
                  </td>
                  <td className="p-3 uppercase font-bold text-emerald-700">
                    {item.conditionMoveIn}
                  </td>
                  <td className="p-3 uppercase font-bold text-slate-700">
                    {item.conditionMoveOut || item.conditionMoveIn}
                  </td>
                  <td className="p-3 text-slate-600 text-[11px] max-w-xs">{item.notesMoveIn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Deductions & Settlement Calculation Table */}
        <div className="mb-8">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
            3. Final Settlement & Refund Ledger
          </h2>
          <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4">
            <div className="flex justify-between text-sm pb-2 border-b border-slate-800">
              <span className="text-slate-400">Original Security Deposit:</span>
              <strong className="font-bold text-white">{formatINR(summary.originalDeposit)}</strong>
            </div>

            {deductions.map((d) => (
              <div key={d.id} className="flex justify-between text-xs text-slate-300">
                <span>
                  {d.title} ({d.status.toUpperCase()})
                </span>
                <span className={d.status === 'agreed' ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
                  {d.status === 'agreed' ? `- ${formatINR(d.agreedAmount)}` : `[Disputed: ${formatINR(d.proposedAmount)}]`}
                </span>
              </div>
            ))}

            <div className="flex justify-between text-base pt-3 border-t-2 border-emerald-500 font-black">
              <span className="text-[#9BF5CC]">Net Refundable Deposit Balance:</span>
              <span className="text-2xl text-emerald-400">{formatINR(summary.finalRefundBalance)}</span>
            </div>
          </div>
        </div>

        {/* Signatures & Mutual Certification */}
        <div className="pt-6 border-t-2 border-slate-200 grid grid-cols-2 gap-8 text-xs text-slate-600">
          <div>
            <div className="font-bold text-slate-900 mb-1">Tenant Acknowledgment</div>
            <div className="h-14 border-b border-slate-400 flex items-end pb-1 font-mono text-[11px] text-emerald-700">
              {property.tenantName ? `✓ Electronically Signed: ${property.tenantName}` : 'Pending Signature'}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Timestamp: {property.termsAgreed.tenantSignedAt || 'Not recorded'}
            </div>
          </div>

          <div>
            <div className="font-bold text-slate-900 mb-1">Landlord Acknowledgment</div>
            <div className="h-14 border-b border-slate-400 flex items-end pb-1 font-mono text-[11px] text-emerald-700">
              {property.landlordName ? `✓ Electronically Signed: ${property.landlordName}` : 'Pending Signature'}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Timestamp: {property.termsAgreed.landlordSignedAt || 'Not recorded'}
            </div>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="mt-8 pt-4 border-t border-slate-200 text-[10px] text-slate-400 text-center leading-relaxed">
          DepositGuard is an evidence documentation software platform. This report certifies that the
          above records were logged and timestamped by the verified participants. DepositGuard does not
          provide escrow custody, financial guarantees, or statutory dispute resolution.
        </div>
      </div>
    </div>
  );
}
