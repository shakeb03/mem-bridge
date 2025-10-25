'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ReadwiseHighlight } from '@/types/readwise';
import { truncateText } from '@/utils/helpers';
import { memColors } from '@/utils/colors';

interface HighlightCardProps {
  highlight: ReadwiseHighlight;
  bookTitle?: string;
  status: 'fetched' | 'valid' | 'warning' | 'error' | 'synced';
  index: number;
}

export default function HighlightCard({
  highlight,
  bookTitle,
  status,
  index,
}: HighlightCardProps) {
  const statusConfig = {
    fetched: {
      bg: 'bg-white',
      border: 'border-gray-200',
      icon: '📄',
    },
    valid: {
      bg: 'bg-green-50',
      border: 'border-green-500',
      icon: '✓',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-500',
      icon: '⚠',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      icon: '✗',
    },
    synced: {
      bg: 'bg-blue-50',
      border: 'border-blue-500',
      icon: '✓',
    },
  };

  const config = statusConfig[status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
      }}
      className={`${config.bg} ${config.border} border-2 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-default`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        {bookTitle && (
          <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
            {truncateText(bookTitle, 40)}
          </h4>
        )}
        <span className="text-lg flex-shrink-0">{config.icon}</span>
      </div>

      {/* Highlight Text */}
      <blockquote className="text-gray-700 text-sm line-clamp-3 italic">
        `&quot;`{truncateText(highlight.text, 150)}`&quot;`
      </blockquote>

      {/* Footer */}
      {highlight.note && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-600 line-clamp-2">
            <strong>Note:</strong> {truncateText(highlight.note, 80)}
          </p>
        </div>
      )}
    </motion.div>
  );
}