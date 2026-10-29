'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building,
  PlusCircle,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Split,
  FileCheck2,
} from 'lucide-react';
import { storage } from '@/lib/storage';
import { Property } from '@/lib/types';
import { formatINR } from '@/lib/settlementCalculator';

export default function PropertiesListPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    setProperties(storage.getProperties());
    const unsub = storage.subscribe(() => {
      setProperties(storage.getProperties());
    });
    return () => unsub();
  }, []);

  const filtered = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Rental Property Records
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Directory of your active tenancies, inspection checklists, and settlement accounts.
          </p>
        </div>

        <Link
          href="/app/properties/new"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#16C784] to-[#12A86E] text-[#07111F] font-bold text-xs sm:text-sm shadow-lg hover:opacity-95 flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Property</span>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0C1B2B] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search address or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#07111F] border border-white/10 text-xs sm:text-sm text-white placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#16C784]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['all', 'settlement_in_progress', 'inspection_pending', 'settled'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterStatus === status
                  ? 'bg-[#16C784] text-[#07111F]'
                  : 'bg-white/5 text-[#94A3B8] hover:text-white'
              }`}
            >
              {status === 'all' ? 'All Records' : status.replace(/_/g, ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Properties Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((prop) => (
          <div
            key={prop.id}
            className="rounded-3xl bg-[#0C1B2B] border border-white/10 p-6 flex flex-col justify-between hover:border-[#16C784]/30 transition-all shadow-xl group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    prop.status === 'settlement_in_progress'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : prop.status === 'settled'
                      ? 'bg-[#16C784]/20 text-[#9BF5CC] border border-[#16C784]/30'
                      : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  }`}
                >
                  {prop.status.replace(/_/g, ' ')}
                </span>
                <span className="text-xs font-mono text-[#94A3B8]">{prop.inviteCode}</span>
              </div>

              <h2 className="text-lg font-bold text-white tracking-tight group-hover:text-[#9BF5CC] transition-colors">
                {prop.title}
              </h2>
              <p className="text-xs text-[#94A3B8] mt-1 mb-4 leading-relaxed">
                {prop.address}, {prop.city} {prop.postalCode}
              </p>

              <div className="p-3 rounded-xl bg-[#102438] border border-white/5 space-y-2 text-xs mb-6">
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Deposit Recorded:</span>
                  <strong className="text-white font-bold">{formatINR(prop.depositAmount)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Monthly Rent:</span>
                  <span className="text-white">{formatINR(prop.monthlyRent)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Tenant:</span>
                  <span className="text-[#9BF5CC] font-medium">{prop.tenantName || 'Pending Invite'}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
              <Link
                href={`/app/properties/${prop.id}/comparison`}
                className="text-xs font-bold text-[#16C784] hover:underline flex items-center gap-1"
              >
                <Split className="w-3.5 h-3.5" />
                Evidence
              </Link>

              <Link
                href={`/app/properties/${prop.id}`}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-white flex items-center gap-1"
              >
                <span>Manage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
