'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'max-w-xl',
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = `dialog-title-${Math.random().toString(36).substring(2, 8)}`;
  const descId = `dialog-desc-${Math.random().toString(36).substring(2, 8)}`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  // Handle native cancel event (Esc key)
  const handleCancel = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onClose();
  };

  // Modern Web Guidance: Pointer check outside dialog bounding box for light-dismiss
  const handlePointerDown = (e: React.PointerEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const rect = dialog.getBoundingClientRect();
    const isOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;
    if (isOutside) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onPointerDown={handlePointerDown}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      className={`fixed inset-0 m-auto p-0 rounded-2xl bg-[#0C1B2B] text-[#F7FAFC] border border-white/10 shadow-2xl backdrop:bg-[#07111F]/80 backdrop:backdrop-blur-md overflow-hidden z-50 w-[92vw] ${maxWidth}`}
    >
      <div className="flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-white/10 bg-[#102438]/80">
          <div>
            <h2 id={titleId} className="text-lg font-bold text-white tracking-tight">
              {title}
            </h2>
            {description && (
              <p id={descId} className="text-xs text-[#94A3B8] mt-1">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto overscroll-contain flex-1 text-sm text-[#F7FAFC]/90">
          {children}
        </div>
      </div>
    </dialog>
  );
}
