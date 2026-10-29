'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Building, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { storage } from '@/lib/storage';

export default function NewPropertyPage() {
  const router = useRouter();
  const currentUser = storage.getCurrentUser();

  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [city, setCity] = useState('Bangalore');
  const [postalCode, setPostalCode] = useState('560038');
  const [depositAmount, setDepositAmount] = useState('100000');
  const [monthlyRent, setMonthlyRent] = useState('35000');
  const [leaseStart, setLeaseStart] = useState('2026-11-01');
  const [leaseEnd, setLeaseEnd] = useState('2027-10-31');
  const [counterpartEmail, setCounterpartEmail] = useState('');
  const [counterpartName, setCounterpartName] = useState('');

  // Agreed clauses
  const [moveInGraceDays, setMoveInGraceDays] = useState(7);
  const [wearTearAcknowledged, setWearTearAcknowledged] = useState(true);
  const [paintingAcknowledged, setPaintingAcknowledged] = useState(true);
  const [cleaningAcknowledged, setCleaningAcknowledged] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !address || !depositAmount) {
      alert('Please fill out the required property and deposit details.');
      return;
    }

    const newId = `prop-${Date.now()}`;
    const isLandlord = currentUser.role === 'landlord';

    storage.saveProperty({
      id: newId,
      title,
      address,
      unitNumber,
      city,
      postalCode,
      depositAmount: Number(depositAmount),
      monthlyRent: Number(monthlyRent),
      currency: 'INR',
      leaseStartDate: leaseStart,
      leaseEndDate: leaseEnd,
      landlordId: isLandlord ? currentUser.id : 'landlord-external',
      landlordName: isLandlord ? currentUser.name : counterpartName || 'Property Landlord',
      landlordEmail: isLandlord ? currentUser.email : counterpartEmail || 'landlord@example.com',
      tenantId: !isLandlord ? currentUser.id : undefined,
      tenantName: !isLandlord ? currentUser.name : counterpartName || undefined,
      tenantEmail: !isLandlord ? currentUser.email : counterpartEmail || undefined,
      inviteCode: `DG-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      status: 'inspection_pending',
      termsAgreed: {
        moveInGraceDays: Number(moveInGraceDays),
        paintingClauseAcknowledged: paintingAcknowledged,
        cleaningStandardAcknowledged: cleaningAcknowledged,
        fairWearTearAcknowledged: wearTearAcknowledged,
        arbitrationAcknowledged: true,
        landlordSignedAt: isLandlord ? new Date().toISOString() : undefined,
        tenantSignedAt: !isLandlord ? new Date().toISOString() : undefined,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    router.push(`/app/properties/${newId}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/app/properties"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#16C784] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Properties
      </Link>

      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Establish New Rental Record
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8]">
          Lock in agreed deposit terms, notice periods, and baseline wear-and-tear definitions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl bg-[#0C1B2B] border border-white/10 p-6 sm:p-8 space-y-8 shadow-2xl">
        {/* Section 1: Property Identification */}
        <div>
          <div className="flex items-center gap-2 mb-4 text-sm font-bold text-white border-b border-white/10 pb-2">
            <Building className="w-4 h-4 text-[#16C784]" />
            1. Property Identification
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-white/90 mb-1">
                Property Label / Nickname *
              </label>
              <input
                type="text"
                placeholder="e.g. Palm Meadows Villa 12 or Indiranagar 2BHK"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#16C784]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-white/90 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                placeholder="Complete address as written in the lease agreement"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#16C784]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/90 mb-1">
                Unit / Flat Number
              </label>
              <input
                type="text"
                placeholder="e.g. 402, Tower B"
                value={unitNumber}
                onChange={(e) => setUnitNumber(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#16C784]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/90 mb-1">City & Postal Code</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#16C784]"
                />
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#16C784]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Financial Terms */}
        <div>
          <div className="flex items-center gap-2 mb-4 text-sm font-bold text-white border-b border-white/10 pb-2">
            <ShieldCheck className="w-4 h-4 text-[#16C784]" />
            2. Financial Deposit Terms
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-1">
                Security Deposit Amount (₹) *
              </label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#16C784]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/90 mb-1">
                Monthly Rent (₹) *
              </label>
              <input
                type="number"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#16C784]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/90 mb-1">Lease Start Date</label>
              <input
                type="date"
                value={leaseStart}
                onChange={(e) => setLeaseStart(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#16C784]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/90 mb-1">Lease End Date</label>
              <input
                type="date"
                value={leaseEnd}
                onChange={(e) => setLeaseEnd(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#16C784]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Counterpart Details */}
        <div>
          <div className="flex items-center gap-2 mb-4 text-sm font-bold text-white border-b border-white/10 pb-2">
            <Sparkles className="w-4 h-4 text-[#16C784]" />
            3. Tenancy Counterpart (Landlord / Tenant)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-1">
                {currentUser.role === 'landlord' ? 'Tenant Name' : 'Landlord Name'}
              </label>
              <input
                type="text"
                placeholder="Full legal name"
                value={counterpartName}
                onChange={(e) => setCounterpartName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#16C784]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/90 mb-1">
                {currentUser.role === 'landlord' ? 'Tenant Email' : 'Landlord Email'}
              </label>
              <input
                type="email"
                placeholder="for invite link delivery"
                value={counterpartEmail}
                onChange={(e) => setCounterpartEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#16C784]"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Agreed Parameters Checklist */}
        <div>
          <div className="text-sm font-bold text-white mb-3">
            4. Mutual Tenancy Clauses & Protocols
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#102438] border border-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={wearTearAcknowledged}
                onChange={(e) => setWearTearAcknowledged(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-[#16C784] focus:ring-[#16C784]"
              />
              <div className="text-xs">
                <strong className="text-white font-semibold">
                  Standard Fair Wear & Tear Clause:
                </strong>{' '}
                <span className="text-[#94A3B8]">
                  Minor paint fading, picture pinholes, and natural hardware ageing cannot be deducted
                  from deposit.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#102438] border border-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={paintingAcknowledged}
                onChange={(e) => setPaintingAcknowledged(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-[#16C784] focus:ring-[#16C784]"
              />
              <div className="text-xs">
                <strong className="text-white font-semibold">Repainting Protocol:</strong>{' '}
                <span className="text-[#94A3B8]">
                  Full-house repaint deductions are only valid if tenant-caused damage exceeds spot
                  touch-ups.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#102438] border border-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={cleaningAcknowledged}
                onChange={(e) => setCleaningAcknowledged(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-[#16C784] focus:ring-[#16C784]"
              />
              <div className="text-xs">
                <strong className="text-white font-semibold">Professional Deep Cleaning Clause:</strong>{' '}
                <span className="text-[#94A3B8]">
                  Move-out cleaning deductions require an itemized service receipt from an accredited provider.
                </span>
              </div>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-xl bg-gradient-to-r from-[#16C784] to-[#12A86E] text-[#07111F] font-bold text-sm shadow-xl hover:opacity-95 transition-all flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5 text-[#07111F]" />
          <span>Save Property Record & Generate Share Link</span>
        </button>
      </form>
    </div>
  );
}
