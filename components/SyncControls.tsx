'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePipelineStore } from '@/store/pipelineStore';
import { SyncConfig } from '@/types/pipeline';
import { memColors } from '@/utils/colors';
import toast from 'react-hot-toast';

export default function SyncControls() {
  const { credentials, setSyncConfig, setStage } = usePipelineStore();
  const [selectedOption, setSelectedOption] = useState<'full' | 'date-range'>('full');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const isBridgeActive = credentials?.readwiseToken && credentials?.memApiKey;

  const handleSync = () => {
    if (!isBridgeActive) {
      toast.error('Please connect both Readwise and Mem first');
      return;
    }

    if (selectedOption === 'date-range' && (!startDate || !endDate)) {
      toast.error('Please select both start and end dates');
      return;
    }

    if (
      selectedOption === 'date-range' &&
      new Date(startDate) > new Date(endDate)
    ) {
      toast.error('Start date must be before end date');
      return;
    }

    const config: SyncConfig = {
      option: selectedOption,
      ...(selectedOption === 'date-range' && {
        dateRange: { start: startDate, end: endDate },
      }),
    };

    setSyncConfig(config);
    setStage('fetching');
    toast.success('Starting sync...');
  };

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-6">
          {/* Sync Option Tabs */}
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setSelectedOption('full')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedOption === 'full'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Full Sync
            </button>
            <button
              onClick={() => setSelectedOption('date-range')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedOption === 'date-range'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Date Range
            </button>
          </div>

          {/* Date Range Inputs */}
          {selectedOption === 'date-range' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-gray-400">→</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </motion.div>
          )}

          {/* Sync Button */}
          <motion.button
            onClick={handleSync}
            disabled={!isBridgeActive}
            whileHover={isBridgeActive ? { scale: 1.05 } : {}}
            whileTap={isBridgeActive ? { scale: 0.95 } : {}}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition-all ${
              isBridgeActive
                ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Sync Now
          </motion.button>
        </div>
      </div>
    </div>
  );
}