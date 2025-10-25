'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { memColors } from '@/utils/colors';

interface BridgeGraphicProps {
  isConnected: boolean;
}

export default function BridgeGraphic({ isConnected }: BridgeGraphicProps) {
  if (!isConnected) {
    return (
      <div className="relative flex items-center justify-center h-24 w-full">
        <div className="text-center">
          <span className="block text-4xl mb-1 opacity-20">🌉</span>
          <span className="text-xs" style={{ color: memColors.gray400 }}>
            Connect to build bridge
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center h-24 w-full">
      <svg
        width="100%"
        height="96"
        viewBox="0 0 600 96"
        preserveAspectRatio="none"
        style={{ width: '100%' }}
      >
        <defs>
          <pattern id="wood" width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill="#c49463"/>
            <line x1="0" y1="4" x2="8" y2="4" stroke="#00000010" strokeWidth="1"/>
          </pattern>
        </defs>
  
        {/* Main bridge deck - extends to edges */}
        <motion.path
          d="M 0,70 Q 300,30 600,70"
          fill="#d4a574"
          stroke="#8b6635"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
  
        {/* Bottom rail */}
        <motion.path
          d="M 0,78 Q 300,38 600,78"
          fill="none"
          stroke="#a67739"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
        />
  
        {/* Vertical planks */}
        {Array.from({ length: 20 }).map((_, i) => {
          const x = i * 30;
          const progress = i / 19;
          const y = 70 - Math.sin(progress * Math.PI) * 40;
          
          return (
            <motion.rect
              key={i}
              x={x}
              y={y - 4}
              width="3"
              height="16"
              fill="#b8884d"
              stroke="#8b6635"
              strokeWidth="0.5"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ delay: 0.3 + i * 0.03, duration: 0.2 }}
            />
          );
        })}
  
        {/* Support posts */}
        {[
          { x: 150, height: 45, y: 25 },
          { x: 300, height: 55, y: 15 },
          { x: 450, height: 45, y: 25 },
        ].map((post, i) => (
          <motion.g key={i}>
            <motion.rect
              x={post.x - 6}
              y={post.y}
              width="12"
              height={post.height}
              rx="2"
              fill="url(#wood)"
              stroke="#6b4423"
              strokeWidth="2"
              initial={{ height: 0, y: 70 }}
              animate={{ height: post.height, y: post.y }}
              transition={{ delay: 0.5 + i * 0.15, duration: 0.4 }}
            />
            <motion.rect
              x={post.x - 8}
              y={post.y - 4}
              width="16"
              height="6"
              rx="1"
              fill="#8b6635"
              stroke="#6b4423"
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 + i * 0.15 }}
            />
          </motion.g>
        ))}
  
        {/* Rope railing */}
        <motion.path
          d="M 0,65 Q 150,40 300,30 Q 450,40 600,65"
          fill="none"
          stroke="#6b4423"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="4,4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        />
  
        {/* Rope knots */}
        {[150, 300, 450].map((x, i) => {
          const y = x === 300 ? 30 : 40;
          return (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill="#4a3520"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.8 + i * 0.1 }}
            />
          );
        })}
  
        {/* Connection points at edges - make it look connected */}
        <motion.circle
          cx="0"
          cy="70"
          r="6"
          fill="#8b6635"
          stroke="#6b4423"
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8 }}
        />
        <motion.circle
          cx="600"
          cy="70"
          r="6"
          fill="#8b6635"
          stroke="#6b4423"
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8 }}
        />
  
        {/* Animated packet */}
        <motion.g
          animate={{ x: [0, 600] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="0" cy="70" r="5" fill={memColors.primary} opacity="0.9">
            <animate attributeName="r" values="5;7;5" dur="1s" repeatCount="indefinite"/>
          </circle>
          <circle cx="0" cy="70" r="10" fill={memColors.primary} opacity="0.3">
            <animate attributeName="r" values="10;14;10" dur="1s" repeatCount="indefinite"/>
          </circle>
        </motion.g>
  
        {/* Water/ground */}
        <ellipse cx="300" cy="88" rx="280" ry="5" fill="#c4e0f5" opacity="0.3"/>
      </svg>
    </div>
  );
}