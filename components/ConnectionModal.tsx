'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { memColors } from '@/utils/colors';
import toast from 'react-hot-toast';

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: 'readwise' | 'mem';
  onConnect: (apiKey: string) => Promise<boolean>;
}

export default function ConnectionModal({
  isOpen,
  onClose,
  service,
  onConnect,
}: ConnectionModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [testing, setTesting] = useState(false);

  const serviceConfig = {
    readwise: {
      name: 'Readwise',
      icon: '📚',
      placeholder: 'Enter your Readwise access token',
      helpUrl: 'https://readwise.io/access_token',
      helpText: 'Get your token from readwise.io/access_token',
    },
    mem: {
      name: 'Mem',
      icon: '🧠',
      placeholder: 'Enter your Mem API key',
      helpUrl: 'https://mem.ai/settings',
      helpText: 'Get your API key from Mem Settings → API',
    },
  };

  const config = serviceConfig[service];

  const handleConnect = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    setTesting(true);
    try {
      const success = await onConnect(apiKey);
      if (success) {
        toast.success(`${config.name} connected successfully!`);
        onClose();
        setApiKey('');
      }
    } catch (error) {
      // Error handled by parent
    } finally {
      setTesting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{config.icon}</span>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Connect {config.name}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Input */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
                  placeholder={config.placeholder}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  autoFocus
                />
                <p className="mt-2 text-xs text-gray-500">
                  {config.helpText}{' '}
                  <a
                    href={config.helpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    →
                  </a>
                </p>
              </div>

              <button
                onClick={handleConnect}
                disabled={testing || !apiKey.trim()}
                className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {testing ? 'Connecting...' : 'Connect'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}