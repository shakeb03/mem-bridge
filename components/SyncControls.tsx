'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePipelineStore } from '@/store/pipelineStore';
import { SyncConfig } from '@/types/pipeline';
import { memColors } from '@/utils/colors';
import toast from 'react-hot-toast';

export default function SyncControls() {
  const { credentials, setSyncConfig, setStage } = usePipelineStore();
  
  // Default to last 7 days
  const getDefaultDateRange = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  };

  const defaults = getDefaultDateRange();
  
  const [selectedOption, setSelectedOption] = useState<'date-range'>('date-range');
  const [startDate, setStartDate] = useState(defaults.start);
  const [endDate, setEndDate] = useState(defaults.end);

  const isBridgeActive = credentials?.readwiseToken && credentials?.memApiKey;

  const handleSync = () => {
    if (!isBridgeActive) {
      toast.error('Please connect both Readwise and Mem first');
      return;
    }

    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error('Start date must be before end date');
      return;
    }

    const config: SyncConfig = {
      option: selectedOption,
      dateRange: { start: startDate, end: endDate },
    };

    setSyncConfig(config);
    setStage('fetching');
    toast.success('Starting sync...');
  };

  return (
    <div 
      className="border-b px-8 py-6"
      style={{ 
        backgroundColor: 'white',
        borderColor: memColors.gray200,
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Limit Warning */}
        <div className="text-center mb-4">
          <div 
            className="inline-block rounded-lg px-4 py-3 border-2"
            style={{
              backgroundColor: memColors.primaryVeryLight,
              borderColor: memColors.primaryLight,
            }}
          >
            <p className="text-sm font-semibold" style={{ color: memColors.accent }}>
              💡 Syncs up to 80 highlights per session per day (400 per day)
            </p>
            <p className="text-xs mt-1" style={{ color: memColors.gray600 }}>
              Large library? Sync week by week for best performance
            </p>
          </div>
        </div>

        {/* Sync Controls */}
        <div className="flex items-center justify-center gap-6">
          {/* Date Range Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <label className="text-sm font-medium" style={{ color: memColors.accent }}>
              Date Range:
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:border-transparent transition-all"
              style={{
                borderColor: memColors.gray300,
              }}
            />
            <span className="text-gray-400">→</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:border-transparent transition-all"
              style={{
                borderColor: memColors.gray300,
              }}
            />
          </motion.div>

          {/* Quick Preset Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                const end = new Date();
                const start = new Date();
                start.setDate(start.getDate() - 7);
                setStartDate(start.toISOString().split('T')[0]);
                setEndDate(end.toISOString().split('T')[0]);
              }}
              className="px-3 py-2 text-xs font-medium rounded-md border transition-colors"
              style={{
                borderColor: memColors.gray300,
                color: memColors.gray700,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = memColors.primaryVeryLight;
                e.currentTarget.style.borderColor = memColors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = memColors.gray300;
              }}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => {
                const end = new Date();
                const start = new Date();
                start.setDate(start.getDate() - 30);
                setStartDate(start.toISOString().split('T')[0]);
                setEndDate(end.toISOString().split('T')[0]);
              }}
              className="px-3 py-2 text-xs font-medium rounded-md border transition-colors"
              style={{
                borderColor: memColors.gray300,
                color: memColors.gray700,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = memColors.primaryVeryLight;
                e.currentTarget.style.borderColor = memColors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = memColors.gray300;
              }}
            >
              Last 30 Days
            </button>
          </div>

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