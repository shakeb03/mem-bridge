'use client';

import React from 'react';
import { usePipelineStore } from '@/store/pipelineStore';
import Header from '@/components/Header';
import SyncControls from '@/components/SyncControls';
import KanbanBoard from '@/components/KanbanBoard';
import StatsBar from '@/components/StatsBar';
import { memColors } from '@/utils/colors';
import Footer from '@/components/Footer';

export default function Home() {
  const { stage } = usePipelineStore();

  return (
    <div 
    className="min-h-screen flex flex-col"
    style={{ backgroundColor: memColors.backgroundWarm }}
  >
      {/* Header with Readwise, Bridge, Mem */}
      <Header />

      {/* Sync Controls */}
      <SyncControls />

      {/* Main Kanban Board */}
      <KanbanBoard />

      {/* Stats Bar at Bottom */}
      <StatsBar />

      {/* Footer */}
      <Footer />

      {/* Loading Overlay for Complete State */}
      {stage === 'complete' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Sync Complete!
            </h2>
            <p className="text-gray-600 mb-6">
              Your highlights have been successfully synced to Mem
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => window.open('https://mem.ai', '_blank')}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                View in Mem
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}