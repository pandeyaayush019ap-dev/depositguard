'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Building2, User, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { storage } from '@/lib/storage';
import { UserRole } from '@/lib/types';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole>('tenant');
  const [propertyTitle, setPropertyTitle] = useState('Indiranagar 2BHK Apartment');
  const [address, setAddress] = useState('12th Main Road, HAL 2nd Stage, Indiranagar');
  const [unit, setUnit] = useState('Apt 4B');
  const [city, setCity] = useState('Bangalore');
  const [depositAmount, setDepositAmount] = useState('95000');
  const [monthlyRent, setMonthlyRent] = useState('32000');
  const [leaseStart, setLeaseStart] = useState('2026-11-01');
  const [leaseEnd, setLeaseEnd] = useState('2027-10-31');

  const handleFinish = () => {
    // Update role
    const current = storage.getCurrentUser();
    storage.setCurrentUser({
      ...current,
      role,
    });

    // Create property record
    storage.saveProperty({
      id: `prop-${Date.now()}`,
      title: propertyTitle,
      address,
      unitNumber: unit,
      city,
      postalCode: '560038',
      depositAmount: Number(depositAmount) || 95000,
      monthlyRent: Number(monthlyRent) || 32000,
      currency: 'INR',
      leaseStartDate: leaseStart,
      leaseEndDate: leaseEnd,
      landlordId: role === 'landlord' ? current.id : 'landlord-external',
      landlordName: role === 'landlord' ? current.name : 'Property Owner',
      landlordEmail: role === 'landlord' ? current.email : 'owner@example.com',
      tenantId: role === 'tenant' ? current.id : undefined,
      tenantName: role === 'tenant' ? current.name : undefined,
      tenantEmail: role === 'tenant' ? current.email : undefined,
      inviteCode: `DG-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      status: 'inspection_pending',
      termsAgreed: {
        moveInGraceDays: 7,
        paintingClauseAcknowledged: true,
        cleaningStandardAcknowledged: true,
        fairWearTearAcknowledged: true,
        arbitrationAcknowledged: true,
        tenantSignedAt: role === 'tenant' ? new Date().toISOString() : undefined,
        landlordSignedAt: role === 'landlord' ? new Date().toISOString() : undefined,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    router.push('/app');
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#102438] text-xs font-semibold text-[#9BF5CC] mb-3">
          <Shield className="w-3.5 h-3.5 text-[#16C784]" />
          Step {step} of 2 • Quick Setup
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Welcome to DepositGuard
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
          Let&apos;s configure your role and document your first rental property.
        </p>
      </div>

      <div className="rounded-3xl bg-[#0C1B2B] border border-white/10 p-6 sm:p-8 shadow-2xl">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white">Select your primary role</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('tenant')}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  role === 'tenant'
                    ? 'bg-[#102438] border-[#16C784] shadow-md shadow-[#16C784]/20'
                    : 'bg-[#07111F] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#16C784]/20 text-[#16C784] flex items-center justify-center mb-3">
                  <User className="w-5 h-5" />
                </div>
                <div className="text-base font-bold text-white">Tenant / Renter</div>
                <p className="text-xs text-[#94A3B8] mt-1">
                  I am moving in or out of a rented flat and want to protect my deposit from unfair
                  deductions.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRole('landlord')}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  role === 'landlord'
                    ? 'bg-[#102438] border-[#16C784] shadow-md shadow-[#16C784]/20'
                    : 'bg-[#07111F] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-3">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="text-base font-bold text-white">Landlord / Owner</div>
                <p className="text-xs text-[#94A3B8] mt-1">
                  I own rental property and want structured photographic condition reports and clear
                  evidence.
                </p>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#16C784] to-[#12A86E] text-[#07111F] font-bold text-sm shadow-lg hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
            >
              <span>Next: Document First Property</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Enter your property details</h2>

            <div>
              <label className="block text-xs font-semibold text-white/90 mb-1">
                Property Nickname / Title
              </label>
              <input
                type="text"
                value={propertyTitle}
                onChange={(e) => setPropertyTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#16C784]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/90 mb-1">
                  Unit / Flat Number
                </label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#16C784]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/90 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#16C784]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/90 mb-1">
                Street Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#16C784]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/90 mb-1">
                  Security Deposit (₹)
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#16C784]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/90 mb-1">
                  Monthly Rent (₹)
                </label>
                <input
                  type="number"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#16C784]"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#16C784] to-[#12A86E] text-[#07111F] font-bold text-sm shadow-lg hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-[#07111F]" />
                <span>Establish Rental Record</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
