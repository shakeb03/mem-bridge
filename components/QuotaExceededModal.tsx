'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, ExternalLink } from 'lucide-react';
import { memColors } from '@/utils/colors';

interface QuotaExceededModalProps {
  isOpen: boolean;
  onClose: () => void;
  details?: {
    plan?: string;
    limit?: number;
    used?: number;
    resetTime?: string;
    upgradeUrl?: string;
    message?: string;
  } | null;
  synced: number;
  errors: number;
}

export default function QuotaExceededModal({
  isOpen,
  onClose,
  details,
  synced,
  errors,
}: QuotaExceededModalProps) {
  const planLabel = details?.plan ? details.plan : 'free';

  let resetLabel: string | null = null;
  if (details?.resetTime) {
    const resetDate = new Date(details.resetTime);
    if (!isNaN(resetDate.getTime())) {
      resetLabel = resetDate.toLocaleDateString();
    }
  }

  const usageLabel = details?.limit
    ? `${details.used ?? 0} of ${details.limit} notes used`
    : undefined;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl z-50 p-6"
          >
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: memColors.errorLight }}
              >
                <XCircle className="w-7 h-7" style={{ color: memColors.error }} />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: memColors.gray500 }}>
                      Mem quota reached
                    </p>
                    <h2 className="text-2xl font-semibold" style={{ color: memColors.accent }}>
                      Free plan limit exceeded
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XCircle className="w-5 h-5" style={{ color: memColors.gray400 }} />
                  </button>
                </div>

                <p className="mt-4 text-sm leading-relaxed" style={{ color: memColors.gray600 }}>
                  {details?.message ||
                    'Mem has stopped creating new notes because your free tier quota has been used up.'}
                </p>

                <div
                  className="mt-4 p-4 rounded-xl border"
                  style={{ borderColor: memColors.gray200, backgroundColor: memColors.primaryVeryLight }}
                >
                  <p className="text-sm font-semibold" style={{ color: memColors.accent }}>
                    Sync summary
                  </p>
                  <ul className="mt-2 space-y-1 text-sm" style={{ color: memColors.gray600 }}>
                    <li>Created: {synced}</li>
                    <li>Failed: {errors}</li>
                    {usageLabel && <li>Usage: {usageLabel}</li>}
                    {resetLabel && <li>Resets on: {resetLabel}</li>}
                    <li>Plan: {planLabel.charAt(0).toUpperCase() + planLabel.slice(1)}</li>
                  </ul>
                </div>

                {details?.upgradeUrl && (
                  <a
                    href={details.upgradeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all"
                    style={{
                      backgroundColor: memColors.primary,
                      color: 'white',
                      boxShadow: '0 6px 16px rgba(228,188,155,0.35)',
                    }}
                  >
                    Upgrade plan
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
