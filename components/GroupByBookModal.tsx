'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { memColors } from '@/utils/colors';

interface GroupByBookModalProps {
  isOpen: boolean;
  onGroup: () => void;
  onKeepSeparate: () => void;
  onClose: () => void;
  groupedBookCount: number;
}

export default function GroupByBookModal({
  isOpen,
  onGroup,
  onKeepSeparate,
  onClose,
  groupedBookCount,
}: GroupByBookModalProps) {
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
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm font-medium" style={{ color: memColors.gray500 }}>
                  Optional grouping
                </p>
                <h2 className="text-2xl font-semibold" style={{ color: memColors.accent }}>
                  Group highlights by book?
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" style={{ color: memColors.gray500 }} />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm leading-relaxed" style={{ color: memColors.gray600 }}>
                We found multiple highlights from {groupedBookCount} book
                {groupedBookCount === 1 ? '' : 's'}. You can combine each book into
                a single Mem note or keep one note per highlight. Grouping keeps
                books together while separate notes give you finer control.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <button
                  onClick={onGroup}
                  className="w-full py-3 rounded-xl font-semibold text-white transition-all"
                  style={{
                    backgroundColor: memColors.primary,
                    boxShadow: '0 6px 16px rgba(228,188,155,0.35)',
                  }}
                >
                  Group by book
                </button>
                <button
                  onClick={onKeepSeparate}
                  className="w-full py-3 rounded-xl font-semibold transition-all border"
                  style={{
                    borderColor: memColors.gray200,
                    color: memColors.accent,
                    backgroundColor: memColors.primaryVeryLight,
                  }}
                >
                  Keep separate notes
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
