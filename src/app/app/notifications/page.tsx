'use client';

import React, { useState, useEffect } from 'react';
import { Clock, ShieldCheck, Filter, Search } from 'lucide-react';
import { storage } from '@/lib/storage';
import { ActivityLog } from '@/lib/types';
import ActivityTimeline from '@/components/app/ActivityTimeline';

export default function NotificationsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLogs(storage.getActivityLogs());
    const unsub = storage.subscribe(() => {
      setLogs(storage.getActivityLogs());
    });
    return () => unsub();
  }, []);

  const filteredLogs = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase()) ||
      l.actorName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Tenancy Audit Log & Activity Feed
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8]">
          Immutable chronological timeline of all recorded move-in audits, deduction proposals, and
          mutual signoffs.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-[#0C1B2B] border border-white/10 flex items-center gap-3">
        <Search className="w-4 h-4 text-[#94A3B8]" />
        <input
          type="text"
          placeholder="Filter audit records by actor, action or property..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-sm text-white placeholder-[#94A3B8]/60 focus:outline-none"
        />
      </div>

      <ActivityTimeline logs={filteredLogs} />
    </div>
  );
}
