'use client';

import React, { useState, useEffect } from 'react';
import { Shield, User, RefreshCcw, Check, Sparkles, AlertCircle } from 'lucide-react';
import { storage } from '@/lib/storage';
import { UserRole } from '@/lib/types';

export default function SettingsPage() {
  const [user, setUser] = useState(storage.getCurrentUser());
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const unsub = storage.subscribe(() => {
      const u = storage.getCurrentUser();
      setUser(u);
      setName(u.name);
      setEmail(u.email);
      setPhone(u.phone || '');
    });
    return () => unsub();
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    storage.setCurrentUser({
      ...user,
      name,
      email,
      phone,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleRoleSwitch = (role: UserRole) => {
    storage.switchRole(role);
  };

  const handleResetData = () => {
    if (confirm('Reset application back to pristine demo state with Skyline Heights sample data?')) {
      storage.resetToDemoData();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Settings & Profile
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8]">
          Manage your account credentials, role switcher, and demo data state.
        </p>
      </div>

      {/* Role Switcher Card */}
      <div className="p-6 rounded-3xl bg-[#0C1B2B] border border-white/10 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-[#16C784]" />
          <h2 className="text-base font-bold text-white">Switch Evaluator Persona</h2>
        </div>
        <p className="text-xs text-[#94A3B8] mb-4">
          Test DepositGuard through the perspective of different stakeholders:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleRoleSwitch('tenant')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              user.role === 'tenant'
                ? 'bg-[#102438] border-[#16C784] shadow-md shadow-[#16C784]/20'
                : 'bg-[#07111F] border-white/10 hover:border-white/20'
            }`}
          >
            <div className="text-sm font-bold text-white">Priya Sharma</div>
            <div className="text-xs text-[#16C784] font-semibold">Tenant Persona</div>
            <div className="text-[11px] text-[#94A3B8] mt-1">Focuses on deposit recovery and wear-and-tear</div>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSwitch('landlord')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              user.role === 'landlord'
                ? 'bg-[#102438] border-sky-400 shadow-md shadow-sky-400/20'
                : 'bg-[#07111F] border-white/10 hover:border-white/20'
            }`}
          >
            <div className="text-sm font-bold text-white">Arjun Mehta</div>
            <div className="text-xs text-sky-400 font-semibold">Landlord Persona</div>
            <div className="text-[11px] text-[#94A3B8] mt-1">Focuses on property condition and damage repairs</div>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSwitch('property_manager')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              user.role === 'property_manager'
                ? 'bg-[#102438] border-purple-400 shadow-md shadow-purple-400/20'
                : 'bg-[#07111F] border-white/10 hover:border-white/20'
            }`}
          >
            <div className="text-sm font-bold text-white">Vikram Rao</div>
            <div className="text-xs text-purple-400 font-semibold">Manager Persona</div>
            <div className="text-[11px] text-[#94A3B8] mt-1">Multi-unit management and dispute mediation</div>
          </button>
        </div>
      </div>

      {/* Edit Profile Form */}
      <form onSubmit={handleSaveProfile} className="p-6 sm:p-8 rounded-3xl bg-[#0C1B2B] border border-white/10 space-y-4 shadow-xl">
        <h2 className="text-base font-bold text-white mb-2">Personal Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/90 mb-1">Full Legal Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#16C784]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/90 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#16C784]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/90 mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#16C784]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/90 mb-1">Assigned Role</label>
            <input
              type="text"
              disabled
              value={user.role.toUpperCase()}
              className="w-full px-4 py-2.5 rounded-xl bg-[#07111F]/50 border border-white/5 text-sm text-[#94A3B8] cursor-not-allowed"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          {saved ? (
            <span className="text-xs font-bold text-[#16C784] flex items-center gap-1">
              <Check className="w-4 h-4" /> Profile Updated!
            </span>
          ) : (
            <span />
          )}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#16C784] text-[#07111F] font-bold text-xs shadow hover:opacity-95"
          >
            Save Changes
          </button>
        </div>
      </form>

      {/* Demo Reset Card */}
      <div className="p-6 rounded-3xl bg-red-500/10 border border-red-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-sm font-bold text-red-300">Reset Local Application State</div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Restores initial Skyline Heights apartment, move-in/out records, and test deductions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetData}
          className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30 text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          <span>Reset All Data</span>
        </button>
      </div>
    </div>
  );
}
