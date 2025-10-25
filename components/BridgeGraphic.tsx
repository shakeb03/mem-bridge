'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { memColors } from '@/utils/colors';

interface BridgeGraphicProps {
  isConnected: boolean;
}

export default function BridgeGraphic({ isConnected }: BridgeGraphicProps) {
  return (
    <div className="relative flex items-center justify-center h-24">
      {isConnected ? (
        <motion.svg
          width="300"
          height="100"
          viewBox="0 0 300 100"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Bridge Path */}
          <defs>
            <linearGradient id="bridgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={memColors.bridgeStart} />
              <stop offset="100%" stopColor={memColors.bridgeEnd} />
            </linearGradient>
          </defs>

          {/* Main Bridge Arc */}
          <motion.path
            d="M 20 80 Q 150 20, 280 80"
            fill="none"
            stroke="url(#bridgeGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />

          {/* Support Lines */}
          <motion.line
            x1="75"
            y1="50"
            x2="75"
            y2="80"
            stroke={memColors.primary}
            strokeWidth="3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.5 }}
          />
          <motion.line
            x1="150"
            y1="25"
            x2="150"
            y2="80"
            stroke={memColors.primary}
            strokeWidth="3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.7 }}
          />
          <motion.line
            x1="225"
            y1="50"
            x2="225"
            y2="80"
            stroke={memColors.primary}
            strokeWidth="3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.9 }}
          />

          {/* Animated Particles */}
          {[0, 1, 2].map((i) => (
            <motion.circle
              key={i}
              r="4"
              fill={memColors.primary}
              initial={{ offsetDistance: '0%', opacity: 0 }}
              animate={{
                offsetDistance: '100%',
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.7,
                ease: 'linear',
              }}
              style={{
                offsetPath: 'path("M 20 80 Q 150 20, 280 80")',
              }}
            />
          ))}
        </motion.svg>
      ) : (
        <div className="text-gray-300 text-sm font-medium">
          Connect both services to build the bridge
        </div>
      )}
    </div>
  );
}