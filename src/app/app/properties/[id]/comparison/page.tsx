'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Split,
  ShieldCheck,
  AlertTriangle,
  PlusCircle,
  FileCheck2,
  Sparkles,
  Info,
} from 'lucide-react';
import { storage } from '@/lib/storage';
import { Property, Inspection, InspectionItem } from '@/lib/types';
import BeforeAfterSlider from '@/components/app/BeforeAfterSlider';
import Modal from '@/components/ui/Modal';

export default function EvidenceComparisonPage() {
  const params = useParams();
  const propertyId = params?.id as string;

  const [property, setProperty] = useState<Property | undefined>(undefined);
  const [items, setItems] = useState<InspectionItem[]>([]);
  const [selectedItemForDeduction, setSelectedItemForDeduction] = useState<InspectionItem | null>(null);
  const [deductionAmount, setDeductionAmount] = useState('2000');
  const [deductionTitle, setDeductionTitle] = useState('');
  const [deductionCategory, setDeductionCategory] = useState<'cleaning' | 'repair' | 'painting'>('repair');
  const [deductionDescription, setDeductionDescription] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const p = storage.getPropertyById(propertyId);
    setProperty(p);

    const inspections = storage.getPropertyInspections(propertyId);
    const moveIn = inspections.find((i) => i.type === 'move_in');
    if (moveIn) {
      setItems(moveIn.items);
    }
  }, [propertyId]);

  const openDeductionModal = (item: InspectionItem) => {
    setSelectedItemForDeduction(item);
    setDeductionTitle(`Repair/Cleaning: ${item.name}`);
    setDeductionDescription(item.notesMoveOut || item.notesMoveIn);
    setIsModalOpen(true);
  };

  const handleCreateDeduction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForDeduction) return;

    const currentUser = storage.getCurrentUser();
    storage.saveDeduction({
      id: `ded-${Date.now()}`,
      propertyId,
      title: deductionTitle,
      category: deductionCategory,
      proposedAmount: Number(deductionAmount) || 0,
      agreedAmount: 0,
      status: 'pending',
      proposedByRole: currentUser.role,
      description: deductionDescription,
      evidenceItemId: selectedItemForDeduction.id,
      evidencePhotoUrl: selectedItemForDeduction.photosMoveOut[0] || selectedItemForDeduction.photosMoveIn[0],
      tenantComment: currentUser.role === 'tenant' ? 'Proposed from tenant side' : undefined,
      landlordComment: currentUser.role === 'landlord' ? 'Proposed by landlord based on move-out evidence' : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    setIsModalOpen(false);
    alert('Deduction proposed and linked to photographic evidence!');
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
            Back to {property?.title || 'Property'}
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Move-In vs Move-Out Evidence Comparison
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Side-by-side photographic delta analysis across each inspected room and fixture.
          </p>
        </div>

        <Link
          href={`/app/properties/${propertyId}/settlement`}
          className="px-5 py-2.5 rounded-xl bg-[#16C784] text-[#07111F] font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2"
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Open Settlement Ledger</span>
        </Link>
      </div>

      {/* Overview Banner */}
      <div className="p-4 rounded-2xl bg-[#0C1B2B] border border-white/10 flex items-start gap-3 text-xs text-[#94A3B8]">
        <Info className="w-4 h-4 text-[#16C784] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>How this works:</strong> Drag the central slider across each photo to inspect changes
          between the move-in baseline and move-out walkthrough. If physical damage exceeds fair wear
          and tear, either party can propose an itemized deduction with supporting quotes.
        </p>
      </div>

      {/* Comparison Sliders List */}
      <div className="space-y-8">
        {items.map((item) => {
          const beforeImg =
            item.photosMoveIn[0] ||
            'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80';
          const afterImg =
            item.photosMoveOut[0] ||
            item.photosMoveIn[0] ||
            'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80';

          return (
            <div key={item.id} className="space-y-3">
              <BeforeAfterSlider
                beforeImage={beforeImg}
                afterImage={afterImg}
                itemName={item.name}
                roomName={item.roomName}
                conditionBefore={item.conditionMoveIn}
                conditionAfter={item.conditionMoveOut || 'Good'}
                notesBefore={item.notesMoveIn}
                notesAfter={item.notesMoveOut || 'No change noted during walkthrough.'}
                defectTags={item.defectTags}
                discrepancyNote={
                  item.hasDiscrepancy
                    ? 'Observable difference noted. Requires mutual review against wear-and-tear definitions.'
                    : undefined
                }
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => openDeductionModal(item)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-[#16C784]" />
                  <span>Propose Deduction for {item.name}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Accessible Propose Deduction Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Propose Deduction from Evidence"
        description="Attach an itemized repair or cleaning quote to this specific photographic difference."
      >
        <form onSubmit={handleCreateDeduction} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/90 mb-1">Deduction Title</label>
            <input
              type="text"
              value={deductionTitle}
              onChange={(e) => setDeductionTitle(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#16C784]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-1">Category</label>
              <select
                value={deductionCategory}
                onChange={(e) => setDeductionCategory(e.target.value as any)}
                className="w-full px-4 py-2 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#16C784]"
              >
                <option value="repair">Repair</option>
                <option value="cleaning">Deep Cleaning</option>
                <option value="painting">Painting</option>
                <option value="replacement">Replacement</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/90 mb-1">
                Proposed Cost (₹)
              </label>
              <input
                type="number"
                value={deductionAmount}
                onChange={(e) => setDeductionAmount(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#16C784]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/90 mb-1">
              Detailed Explanation / Invoice Details
            </label>
            <textarea
              rows={3}
              value={deductionDescription}
              onChange={(e) => setDeductionDescription(e.target.value)}
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
              Add to Settlement Ledger
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
