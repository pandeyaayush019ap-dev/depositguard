'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Plus,
  Upload,
  Tag,
  ShieldCheck,
  FileCheck2,
  Trash2,
  AlertCircle,
  Zap,
  Droplet,
  Flame,
} from 'lucide-react';
import { storage } from '@/lib/storage';
import { Property, Inspection, InspectionItem, ConditionRating } from '@/lib/types';

function InspectionManagerContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const propertyId = params?.id as string;
  const initialType = (searchParams.get('type') as 'move_in' | 'move_out') || 'move_in';

  const [property, setProperty] = useState<Property | undefined>(undefined);
  const [inspectionType, setInspectionType] = useState<'move_in' | 'move_out'>(initialType);
  const [currentInspection, setCurrentInspection] = useState<Inspection | undefined>(undefined);
  const [items, setItems] = useState<InspectionItem[]>([]);
  const [activeRoomFilter, setActiveRoomFilter] = useState('All');

  // New item modal/form states
  const [newItemName, setNewItemName] = useState('');
  const [newItemRoom, setNewItemRoom] = useState('Living Room');
  const [newItemCondition, setNewItemCondition] = useState<ConditionRating>('good');
  const [newItemNotes, setNewItemNotes] = useState('');
  const [newItemDefectTag, setNewItemDefectTag] = useState('');
  const [newItemPhoto, setNewItemPhoto] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);

  // Meter readings
  const [elecMeter, setElecMeter] = useState<string>('4820');
  const [waterMeter, setWaterMeter] = useState<string>('312');
  const [gasMeter, setGasMeter] = useState<string>('84');

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const p = storage.getPropertyById(propertyId);
    setProperty(p);

    const allInspections = storage.getPropertyInspections(propertyId);
    const existing = allInspections.find((i) => i.type === inspectionType);

    if (existing) {
      setCurrentInspection(existing);
      setItems(existing.items);
      setElecMeter(existing.meterReadings.electricityKwh?.toString() || '');
      setWaterMeter(existing.meterReadings.waterMeterKl?.toString() || '');
      setGasMeter(existing.meterReadings.gasMeterUnits?.toString() || '');
    } else {
      // Initialize with move-in items if switching to move-out
      const moveIn = allInspections.find((i) => i.type === 'move_in');
      const baseItems = moveIn?.items || [];
      setItems(baseItems);
      setCurrentInspection({
        id: `insp-${propertyId}-${inspectionType}`,
        propertyId,
        type: inspectionType,
        status: 'draft',
        inspectorName: storage.getCurrentUser().name,
        inspectorRole: storage.getCurrentUser().role,
        inspectionDate: new Date().toISOString().split('T')[0],
        meterReadings: {},
        items: baseItems,
      });
    }
  }, [propertyId, inspectionType]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setNewItemPhoto(uploadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) return;

    const newItem: InspectionItem = {
      id: `item-${Date.now()}`,
      roomId: `room-${newItemRoom.toLowerCase().replace(/\s+/g, '-')}`,
      roomName: newItemRoom,
      name: newItemName,
      conditionMoveIn: inspectionType === 'move_in' ? newItemCondition : 'good',
      conditionMoveOut: inspectionType === 'move_out' ? newItemCondition : undefined,
      notesMoveIn: inspectionType === 'move_in' ? newItemNotes : 'No initial notes',
      notesMoveOut: inspectionType === 'move_out' ? newItemNotes : undefined,
      photosMoveIn:
        inspectionType === 'move_in'
          ? newItemPhoto
            ? [newItemPhoto]
            : ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80']
          : [],
      photosMoveOut:
        inspectionType === 'move_out'
          ? newItemPhoto
            ? [newItemPhoto]
            : ['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80']
          : [],
      defectTags: newItemDefectTag ? [newItemDefectTag] : [],
      hasDiscrepancy: inspectionType === 'move_out' && newItemCondition === 'damaged',
    };

    const updated = [newItem, ...items];
    setItems(updated);
    setIsAddingItem(false);
    setNewItemName('');
    setNewItemNotes('');
    setNewItemDefectTag('');
    setNewItemPhoto('');
  };

  const handleSaveInspection = () => {
    const currentUser = storage.getCurrentUser();
    const updatedInspection: Inspection = {
      id: currentInspection?.id || `insp-${propertyId}-${inspectionType}`,
      propertyId,
      type: inspectionType,
      status: 'submitted',
      inspectorName: currentUser.name,
      inspectorRole: currentUser.role,
      inspectionDate: new Date().toISOString().split('T')[0],
      meterReadings: {
        electricityKwh: Number(elecMeter) || undefined,
        waterMeterKl: Number(waterMeter) || undefined,
        gasMeterUnits: Number(gasMeter) || undefined,
      },
      items,
      submittedAt: new Date().toISOString(),
      tenantAcknowledgedAt: currentUser.role === 'tenant' ? new Date().toISOString() : undefined,
      landlordAcknowledgedAt: currentUser.role === 'landlord' ? new Date().toISOString() : undefined,
    };

    storage.saveInspection(updatedInspection);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const roomsList = ['All', 'Living Room', 'Kitchen', 'Master Bedroom', 'Master Bathroom', 'Balcony'];

  const filteredItems = items.filter(
    (item) => activeRoomFilter === 'All' || item.roomName === activeRoomFilter
  );

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
            Inspection Checklist & Evidence Upload
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Capture condition ratings, photographic proof, defect tags, and meter readings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveInspection}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#16C784] to-[#12A86E] text-[#07111F] font-bold text-xs sm:text-sm shadow-lg hover:opacity-95 flex items-center gap-2"
          >
            <FileCheck2 className="w-4 h-4 text-[#07111F]" />
            <span>{isSaved ? 'Inspection Saved!' : 'Save & Sign Inspection'}</span>
          </button>
        </div>
      </div>

      {/* Inspection Mode Switcher */}
      <div className="p-1 rounded-2xl bg-[#0C1B2B] border border-white/10 flex">
        <button
          type="button"
          onClick={() => setInspectionType('move_in')}
          className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            inspectionType === 'move_in'
              ? 'bg-[#16C784] text-[#07111F] shadow'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <Camera className="w-4 h-4" />
          Move-In Baseline Walkthrough
        </button>
        <button
          type="button"
          onClick={() => setInspectionType('move_out')}
          className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            inspectionType === 'move_out'
              ? 'bg-amber-400 text-[#07111F] shadow'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <Camera className="w-4 h-4" />
          Move-Out Exit Walkthrough
        </button>
      </div>

      {/* Meter Readings Card */}
      <div className="p-6 rounded-3xl bg-[#0C1B2B] border border-white/10 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold text-white tracking-tight">Utility Meter Readings</h3>
          </div>
          <span className="text-[11px] text-[#94A3B8]">Timestamped with inspection</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/90 mb-1 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Electricity (kWh)
            </label>
            <input
              type="number"
              value={elecMeter}
              onChange={(e) => setElecMeter(e.target.value)}
              placeholder="e.g. 4820"
              className="w-full px-4 py-2 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#16C784]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/90 mb-1 flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-sky-400" />
              Water Meter (kL)
            </label>
            <input
              type="number"
              value={waterMeter}
              onChange={(e) => setWaterMeter(e.target.value)}
              placeholder="e.g. 312"
              className="w-full px-4 py-2 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#16C784]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/90 mb-1 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              Piped Gas (Units)
            </label>
            <input
              type="number"
              value={gasMeter}
              onChange={(e) => setGasMeter(e.target.value)}
              placeholder="e.g. 84"
              className="w-full px-4 py-2 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#16C784]"
            />
          </div>
        </div>
      </div>

      {/* Room Filter Pills & Add Item Button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {roomsList.map((room) => (
            <button
              key={room}
              type="button"
              onClick={() => setActiveRoomFilter(room)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeRoomFilter === room
                  ? 'bg-[#16C784] text-[#07111F]'
                  : 'bg-[#0C1B2B] text-[#94A3B8] hover:text-white border border-white/5'
              }`}
            >
              {room}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsAddingItem(!isAddingItem)}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4 text-[#16C784]" />
          <span>Add Inspection Item / Defect</span>
        </button>
      </div>

      {/* Add Item Form (Inline) */}
      {isAddingItem && (
        <form
          onSubmit={handleAddItem}
          className="p-6 rounded-3xl bg-[#0C1B2B] border border-[#16C784]/30 space-y-4 shadow-xl"
        >
          <h4 className="text-base font-bold text-white">New Inspection Item / Evidence</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-1">Room Area</label>
              <select
                value={newItemRoom}
                onChange={(e) => setNewItemRoom(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#16C784]"
              >
                {roomsList.filter((r) => r !== 'All').map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/90 mb-1">
                Item / Fixture Name
              </label>
              <input
                type="text"
                placeholder="e.g. Geyser switch, Balcony floor tile, Master Bed AC"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#16C784]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/90 mb-1">
                Condition Rating
              </label>
              <select
                value={newItemCondition}
                onChange={(e) => setNewItemCondition(e.target.value as ConditionRating)}
                className="w-full px-4 py-2 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#16C784]"
              >
                <option value="pristine">Pristine (Brand new / flawless)</option>
                <option value="good">Good (Clean, working normally)</option>
                <option value="fair">Fair (Normal wear, minor scuffs)</option>
                <option value="damaged">Damaged (Broken, leaking, cracked)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/90 mb-1">
                Defect Tag (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. pre-existing-scratch, loose-hinge"
                value={newItemDefectTag}
                onChange={(e) => setNewItemDefectTag(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#16C784]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-white/90 mb-1">Condition Notes</label>
              <textarea
                rows={2}
                placeholder="Detailed description of visible condition, brand name, functionality..."
                value={newItemNotes}
                onChange={(e) => setNewItemNotes(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#16C784]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-white/90 mb-1">
                Attach Photo Evidence (Camera / File)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full text-xs text-[#94A3B8] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#16C784] file:text-[#07111F] hover:file:opacity-90"
              />
              {newItemPhoto && (
                <div className="mt-2 w-28 h-20 rounded-xl overflow-hidden border border-white/20">
                  <img src={newItemPhoto} alt="Upload preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingItem(false)}
              className="px-4 py-2 rounded-xl bg-white/5 text-xs font-semibold text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#16C784] text-[#07111F] text-xs font-bold shadow"
            >
              Save Item to Checklist
            </button>
          </div>
        </form>
      )}

      {/* Items List Grid */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const condition =
            inspectionType === 'move_in' ? item.conditionMoveIn : item.conditionMoveOut || 'good';
          const notes =
            inspectionType === 'move_in' ? item.notesMoveIn : item.notesMoveOut || item.notesMoveIn;
          const photos =
            inspectionType === 'move_in'
              ? item.photosMoveIn
              : item.photosMoveOut.length > 0
              ? item.photosMoveOut
              : item.photosMoveIn;

          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[#0C1B2B] border border-white/10 flex flex-col md:flex-row items-start gap-5 shadow-lg"
            >
              {/* Photo Preview */}
              <div className="w-full md:w-44 h-32 rounded-xl overflow-hidden bg-[#07111F] shrink-0 border border-white/10 relative">
                {photos[0] ? (
                  <img src={photos[0]} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#94A3B8] text-xs">
                    <Camera className="w-6 h-6 mb-1 text-white/40" />
                    <span>No Photo</span>
                  </div>
                )}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#07111F]/80 backdrop-blur-md text-[10px] font-bold text-white">
                  {item.roomName}
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-base font-bold text-white tracking-tight">{item.name}</h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      condition === 'damaged'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : condition === 'fair'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-[#16C784]/20 text-[#9BF5CC] border border-[#16C784]/30'
                    }`}
                  >
                    {condition}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#F7FAFC]/90 leading-relaxed font-normal">
                  {notes}
                </p>

                {item.defectTags && item.defectTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.defectTags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/5 text-[#9BF5CC] border border-white/10"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function InspectionManagerPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-[#94A3B8]">
          Loading inspection walkthrough...
        </div>
      }
    >
      <InspectionManagerContent />
    </Suspense>
  );
}
