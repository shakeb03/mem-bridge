'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReadwiseHighlight, ReadwiseBook } from '@/types/readwise';
import HighlightCard from './HighlightCard';
import { memColors } from '@/utils/colors';

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
    <div 
      className="flex flex-col h-full rounded-2xl border-2 shadow-lg overflow-hidden"
      style={{ 
        backgroundColor: 'white',
        borderColor: memColors.gray200,
      }}
    >
      {/* Column Header */}
      <div 
        className="flex items-center gap-3 p-5 border-b"
        style={{ 
          backgroundColor: memColors.primaryVeryLight,
          borderColor: memColors.gray200,
        }}
      >
        <span className="text-3xl">{icon}</span>
        <div className="flex-1">
          <h3 
            className="font-semibold text-lg"
            style={{ color: memColors.accent }}
          >
            {title}
          </h3>
          <p className="text-xs" style={{ color: memColors.gray500 }}>
            {highlights.length} items
          </p>
        </div>
        {highlights.length > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
            style={{ 
              backgroundColor: memColors.primaryLight,
              color: memColors.accent,
            }}
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