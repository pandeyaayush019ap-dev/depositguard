'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Calendar, Tag, ShieldAlert, Sparkles, Check } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  beforeDate?: string;
  afterDate?: string;
  itemName: string;
  roomName: string;
  conditionBefore: string;
  conditionAfter: string;
  notesBefore: string;
  notesAfter: string;
  defectTags?: string[];
  discrepancyNote?: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Move-In Baseline',
  afterLabel = 'Move-Out Walkthrough',
  beforeDate = 'Nov 1, 2025',
  afterDate = 'Oct 27, 2026',
  itemName,
  roomName,
  conditionBefore,
  conditionAfter,
  notesBefore,
  notesAfter,
  defectTags = [],
  discrepancyNote,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <div className="rounded-2xl bg-[#0C1B2B] border border-white/10 overflow-hidden shadow-xl">
      {/* Header Info */}
      <div className="p-4 sm:p-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-[#102438]/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#16C784]/20 text-[#9BF5CC]">
              {roomName}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">{itemName}</h3>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Drag the central slider left or right to inspect physical differences.
          </p>
        </div>

        {defectTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {defectTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Split Image Canvas */}
      <div
        ref={containerRef}
        className="relative w-full h-[320px] sm:h-[420px] select-none overflow-hidden cursor-ew-resize bg-[#07111F]"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
      >
        {/* After Image (Background full width) */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${afterImage})` }}
        >
          {/* Label Move-Out */}
          <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-[#07111F]/80 backdrop-blur-md border border-white/10 text-xs font-bold text-white shadow-lg flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            {afterLabel} ({afterDate})
          </div>
        </div>

        {/* Before Image (Foreground clipped by slider) */}
        <div
          className="absolute inset-0 overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage: `url(${beforeImage})`,
            width: `${sliderPosition}%`,
          }}
        >
          {/* Label Move-In */}
          <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-[#07111F]/80 backdrop-blur-md border border-[#16C784]/30 text-xs font-bold text-[#9BF5CC] shadow-lg flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-[#16C784]" />
            {beforeLabel} ({beforeDate})
          </div>
        </div>

        {/* Draggable Divider Line & Knob */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#07111F] border-2 border-white shadow-xl flex items-center justify-center text-white">
            <div className="flex gap-1">
              <span className="text-[10px] font-black">◀</span>
              <span className="text-[10px] font-black">▶</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accessible Slider Range Control */}
      <div className="p-3 bg-[#07111F] border-t border-white/5 flex items-center gap-3">
        <label htmlFor="evidence-range" className="text-xs font-medium text-[#94A3B8] whitespace-nowrap">
          Slide to compare:
        </label>
        <input
          id="evidence-range"
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={(e) => setSliderPosition(Number(e.target.value))}
          className="w-full h-1.5 bg-[#1E3752] rounded-lg appearance-none cursor-pointer accent-[#16C784]"
          aria-label="Image comparison slider position"
        />
        <span className="text-xs font-mono text-[#9BF5CC] w-12 text-right">{Math.round(sliderPosition)}%</span>
      </div>

      {/* Condition & Notes Comparison Matrix */}
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0C1B2B]">
        {/* Left Column: Move-In Details */}
        <div className="p-4 rounded-xl bg-[#102438] border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#9BF5CC] uppercase tracking-wider flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-[#16C784]" />
              Baseline Condition
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#16C784]/20 text-[#9BF5CC]">
              {conditionBefore.toUpperCase()}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#F7FAFC]/90 leading-relaxed font-normal">{notesBefore}</p>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-[11px] text-[#94A3B8]">
            <Calendar className="w-3.5 h-3.5" />
            Verified on {beforeDate} by mutual signoff
          </div>
        </div>

        {/* Right Column: Move-Out Details */}
        <div className="p-4 rounded-xl bg-[#102438] border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Observed at Move-Out
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
              {conditionAfter.toUpperCase()}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#F7FAFC]/90 leading-relaxed font-normal">{notesAfter}</p>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-[11px] text-[#94A3B8]">
            <Calendar className="w-3.5 h-3.5" />
            Recorded on {afterDate}
          </div>
        </div>
      </div>

      {discrepancyNote && (
        <div className="p-3.5 bg-amber-500/10 border-t border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-200">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-amber-300">Flagged for Human Review: </strong>
            {discrepancyNote}
          </div>
        </div>
      )}
    </div>
  );
}
