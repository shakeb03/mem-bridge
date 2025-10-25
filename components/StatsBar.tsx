'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { usePipelineStore } from '@/store/pipelineStore';

export default function StatsBar() {
  const { stage, fetchedData, validationSummary, syncProgress } =
    usePipelineStore();

  const stats = [
    {
      label: 'Fetched',
      value: fetchedData.highlights.length,
      color: 'text-gray-700',
    },
    {
      label: 'Valid',
      value: validationSummary.valid,
      color: 'text-green-700',
    },
    {
      label: 'Invalid',
      value: validationSummary.invalid,
      color: 'text-red-700',
    },
    {
      label: 'Synced',
      value: syncProgress.synced,
      color: 'text-blue-700',
    },
  ];

  if (stage === 'idle' || stage === 'connecting') return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-t border-gray-200 px-8 py-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <p className={`text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}