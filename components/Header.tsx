'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { usePipelineStore } from '@/store/pipelineStore';
import { memColors } from '@/utils/colors';
import BridgeGraphic from './BridgeGraphic';
import ConnectionModal from './ConnectionModal';
import toast from 'react-hot-toast';

export default function Header() {
  const { credentials, setCredentials } = usePipelineStore();
  const [modalOpen, setModalOpen] = useState<'readwise' | 'mem' | null>(null);

  const testReadwise = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/readwise/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.success) {
        setCredentials({
          readwiseToken: token,
          memApiKey: credentials?.memApiKey || '',
        });
        return true;
      } else {
        toast.error(data.error || 'Failed to connect to Readwise');
        return false;
      }
    } catch {
      toast.error('Network error');
      return false;
    }
  };

  const testMem = async (apiKey: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/mem/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
      });

      const data = await response.json();

      if (data.success) {
        setCredentials({
          readwiseToken: credentials?.readwiseToken || '',
          memApiKey: apiKey,
        });
        return true;
      } else {
        toast.error(data.error || 'Failed to connect to Mem');
        return false;
      }
    } catch {
      toast.error('Network error');
      return false;
    }
  };

  const isReadwiseConnected = !!credentials?.readwiseToken;
  const isMemConnected = !!credentials?.memApiKey;
  const isBridgeActive = isReadwiseConnected && isMemConnected;

  return (
    <>
      <header 
        className="border-b px-6 py-4"
        style={{ 
          backgroundColor: memColors.backgroundWarm,
          borderColor: memColors.gray200 
        }}
      >
        <div className="max-w-6xl mx-auto">
  {/* Remove gap, make bridge connect seamlessly */}
  <div className="flex items-center justify-between">
    
    {/* LEFT: Readwise */}
    <motion.button
      onClick={() => setModalOpen('readwise')}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-3 p-3 rounded-xl border-2 transition-all relative z-10"
      style={{
        borderColor: isReadwiseConnected 
          ? memColors.success 
          : memColors.gray300,
        backgroundColor: isReadwiseConnected 
          ? '#ffffff' 
          : 'transparent',
        boxShadow: isReadwiseConnected 
          ? '0 2px 8px rgba(124,179,66,0.12)' 
          : 'none',
        width: '200px',
      }}
    >
      <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center flex-shrink-0">
        <Image
          src="https://readwise.io/favicon.ico"
          alt="Readwise"
          width={32}
          height={32}
          unoptimized
        />
      </div>

      <div className="text-left flex-1 min-w-0">
        <h3 className="font-semibold text-sm" style={{ color: memColors.accent }}>
          Readwise
        </h3>
        <p 
          className="text-xs font-medium truncate"
          style={{ 
            color: isReadwiseConnected 
              ? memColors.success 
              : memColors.gray500 
          }}
        >
          {isReadwiseConnected ? '✓ Connected' : 'Connect'}
        </p>
      </div>
    </motion.button>

    {/* CENTER: Bridge - stretches between boxes */}
<div className="flex-1 flex items-center -mx-8 relative" style={{ zIndex: 5 }}>
  <BridgeGraphic isConnected={isBridgeActive} />
</div>

    {/* RIGHT: Mem */}
    <motion.button
      onClick={() => setModalOpen('mem')}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-3 p-3 rounded-xl border-2 transition-all relative z-10"
      style={{
        borderColor: isMemConnected 
          ? memColors.success 
          : memColors.gray300,
        backgroundColor: isMemConnected 
          ? '#ffffff' 
          : 'transparent',
        boxShadow: isMemConnected 
          ? '0 2px 8px rgba(124,179,66,0.12)' 
          : 'none',
        width: '200px',
        zIndex: 10,
      }}
    >
      <div 
        className="w-12 h-12 rounded-lg shadow-sm flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: memColors.primaryLight }}
      >
        <Image
          src="/mem-logo.png"
          alt="Mem"
          width={32}
          height={32}
          unoptimized
        />
      </div>

      <div className="text-left flex-1 min-w-0">
        <h3 className="font-semibold text-sm" style={{ color: memColors.accent }}>
          Mem
        </h3>
        <p 
          className="text-xs font-medium truncate"
          style={{ 
            color: isMemConnected 
              ? memColors.success 
              : memColors.gray500 
          }}
        >
          {isMemConnected ? '✓ Connected' : 'Connect'}
        </p>
      </div>
    </motion.button>
  </div>
</div>
      </header>
  
      {/* Connection Modals */}
      <ConnectionModal
        isOpen={modalOpen === 'readwise'}
        onClose={() => setModalOpen(null)}
        service="readwise"
        onConnect={testReadwise}
      />

      <ConnectionModal
        isOpen={modalOpen === 'mem'}
        onClose={() => setModalOpen(null)}
        service="mem"
        onConnect={testMem}
      />
    </>
  );
}