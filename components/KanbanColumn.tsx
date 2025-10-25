'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReadwiseHighlight, ReadwiseBook } from '@/types/readwise';
import HighlightCard from './HighlightCard';

interface KanbanColumnProps {
  title: string;
  icon: string;
  highlights: ReadwiseHighlight[];
  books: ReadwiseBook[];
  status: 'fetched' | 'valid' | 'warning' | 'error' | 'synced';
  emptyMessage: string;
}

export default function KanbanColumn({
  title,
  icon,
  highlights,
  books,
  status,
  emptyMessage,
}: KanbanColumnProps) {
  const getBookTitle = (bookId: number): string => {
    const book = books.find((b) => b.id === bookId);
    return book?.title || 'Unknown Source';
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-xl border border-gray-200">
      {/* Column Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white rounded-t-xl">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500">{highlights.length} items</p>
        </div>
        {highlights.length > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold"
          >
            {highlights.length}
          </motion.div>
        )}
      </div>

      {/* Column Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {highlights.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex items-center justify-center"
            >
              <p className="text-sm text-gray-400 text-center px-4">
                {emptyMessage}
              </p>
            </motion.div>
          ) : (
            highlights.map((highlight, index) => (
              <HighlightCard
                key={highlight.id}
                highlight={highlight}
                bookTitle={getBookTitle(highlight.book_id)}
                status={status}
                index={index}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}