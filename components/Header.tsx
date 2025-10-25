'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
    } catch (error) {
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
    } catch (error) {
      toast.error('Network error');
      return false;
    }
  };

  const isReadwiseConnected = !!credentials?.readwiseToken;
  const isMemConnected = !!credentials?.memApiKey;
  const isBridgeActive = isReadwiseConnected && isMemConnected;

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 items-center gap-8">
            {/* Readwise Section */}
            <motion.button
              onClick={() => setModalOpen('readwise')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                isReadwiseConnected
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
              }`}
            >
              <span className="text-4xl">📚</span>
              <div className="text-left flex-1">
                <h3 className="font-semibold text-gray-900">Readwise</h3>
                <p className="text-sm text-gray-600">
                  {isReadwiseConnected ? '✓ Connected' : 'Click to connect'}
                </p>
              </div>
            </motion.button>

            {/* Bridge Section */}
            <div className="flex flex-col items-center">
              <BridgeGraphic isConnected={isBridgeActive} />
              {isBridgeActive && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-medium text-blue-600 mt-2"
                >
                  Bridge Active ✓
                </motion.div>
              )}
            </div>

            {/* Mem Section */}
            <motion.button
              onClick={() => setModalOpen('mem')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                isMemConnected
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
              }`}
            >
              <span className="text-4xl">🧠</span>
              <div className="text-left flex-1">
                <h3 className="font-semibold text-gray-900">Mem</h3>
                <p className="text-sm text-gray-600">
                  {isMemConnected ? '✓ Connected' : 'Click to connect'}
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