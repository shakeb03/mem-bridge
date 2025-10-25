'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { usePipelineStore } from '@/store/pipelineStore';
import { memColors } from '@/utils/colors';

export default function StatsBar() {
  const { stage, fetchedData, validationSummary, syncProgress } =
    usePipelineStore();

    const stats = [
      {
        label: 'Fetched',
        value: fetchedData.highlights.length,
        colorValue: memColors.gray700,
      },
      {
        label: 'Valid',
        value: validationSummary.valid,
        colorValue: memColors.success,
      },
      {
        label: 'Invalid',
        value: validationSummary.invalid,
        colorValue: memColors.error,
      },
      {
        label: 'Synced',
        value: syncProgress.synced,
        colorValue: memColors.primary,
      },
    ];

  if (stage === 'idle' || stage === 'connecting') return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-t px-8 py-5"
      style={{ 
        backgroundColor: 'white',
        borderColor: memColors.gray200,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <p className="text-4xl font-bold" style={{ color: stat.colorValue }}>
                {stat.value}
              </p>
              <p 
                className="text-xs mt-1 font-medium"
                style={{ color: memColors.gray600 }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}