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
    <div 
      className="border-b px-8 py-4"
      style={{ 
        backgroundColor: 'white',
        borderColor: memColors.gray200,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-6">
          {/* Sync Option Tabs */}
          <div 
            className="flex gap-2 p-1 rounded-lg"
            style={{ backgroundColor: memColors.gray100 }}
          >
            <button
              onClick={() => setSelectedOption('full')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedOption === 'full'
                  ? 'shadow-sm'
                  : ''
              }`}
              style={{
                backgroundColor: selectedOption === 'full' ? 'white' : 'transparent',
                color: selectedOption === 'full' ? memColors.accent : memColors.gray600,
              }}
            >
              Full Sync
            </button>
            <button
              onClick={() => setSelectedOption('date-range')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedOption === 'date-range'
                  ? 'shadow-sm'
                  : ''
              }`}
              style={{
                backgroundColor: selectedOption === 'date-range' ? 'white' : 'transparent',
                color: selectedOption === 'date-range' ? memColors.accent : memColors.gray600,
              }}
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
            className="px-8 py-3 rounded-xl font-semibold text-white transition-all"
            style={{
              backgroundColor: isBridgeActive ? memColors.primary : memColors.gray300,
              boxShadow: isBridgeActive 
                ? '0 4px 14px rgba(228,188,155,0.4)' 
                : 'none',
            }}
          >
            Sync Now
          </motion.button>
        </div>
      </div>
    </div>
  );
}