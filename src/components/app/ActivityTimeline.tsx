'use client';

import React from 'react';
import { ActivityLog } from '@/lib/types';
import {
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  User,
  ShieldCheck,
} from 'lucide-react';

interface ActivityTimelineProps {
  logs: ActivityLog[];
}

export default function ActivityTimeline({ logs }: ActivityTimelineProps) {
  const getIcon = (action: string) => {
    if (action.includes('Agreed') || action.includes('Signed') || action.includes('Created')) {
      return <CheckCircle className="w-4 h-4 text-[#16C784]" />;
    }
    if (action.includes('Disputed') || action.includes('Flagged')) {
      return <AlertCircle className="w-4 h-4 text-amber-400" />;
    }
    if (action.includes('Inspection')) {
      return <ShieldCheck className="w-4 h-4 text-sky-400" />;
    }
    return <FileText className="w-4 h-4 text-[#94A3B8]" />;
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  if (!logs || logs.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl bg-[#0C1B2B] border border-white/10 text-sm text-[#94A3B8]">
        No activity logged yet.
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[#0C1B2B] border border-white/10 p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-4 h-4 text-[#16C784]" />
        <h4 className="text-base font-bold text-white tracking-tight">Tenancy Audit Log & History</h4>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
        {logs.map((log) => (
          <div key={log.id} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-[#07111F] border border-white/20 flex items-center justify-center">
              {getIcon(log.action)}
            </div>

            <div className="bg-[#102438]/60 hover:bg-[#102438] transition-colors p-3.5 rounded-xl border border-white/5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <span className="text-sm font-bold text-white">{log.action}</span>
                <span className="text-[11px] font-mono text-[#94A3B8]">{formatDate(log.timestamp)}</span>
              </div>
              <p className="text-xs text-[#F7FAFC]/80 leading-relaxed">{log.details}</p>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-[#94A3B8]">
                <User className="w-3 h-3 text-[#16C784]" />
                <span>
                  {log.actorName} ({log.actorRole.toUpperCase()})
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
