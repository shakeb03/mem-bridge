'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePipelineStore } from '@/store/pipelineStore';
import { ReadwiseHighlight } from '@/types/readwise';
import { getValidHighlights, getInvalidHighlights } from '@/lib/validation';
import KanbanColumn from './KanbanColumn';
import toast from 'react-hot-toast';
import { memColors } from '@/utils/colors';
import { analytics } from '@/lib/analytics';


export default function KanbanBoard() {
  const {
    credentials,
    syncConfig,
    stage,
    fetchedData,
    validationSummary,
    setFetchedData,
    setValidationSummary,
    setStage,
  } = usePipelineStore();

  const [fetchedHighlights, setFetchedHighlights] = useState<ReadwiseHighlight[]>([]);
  const [validatingHighlights, setValidatingHighlights] = useState<ReadwiseHighlight[]>([]);
  const [syncedHighlights, setSyncedHighlights] = useState<ReadwiseHighlight[]>([]);

  // Fetch from Readwise
  useEffect(() => {
    if (stage !== 'fetching' || !credentials) return;

    const fetchHighlights = async () => {
      try {
        const response = await fetch('/api/readwise/fetch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: credentials.readwiseToken,
            dateRange: syncConfig?.dateRange,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setFetchedData(data.data.highlights, data.data.books);
          setFetchedHighlights(data.data.highlights);
          toast.success(`Fetched ${data.data.count} highlights!`);
          
          analytics.syncStarted({
            syncType: syncConfig?.option || 'full',
            highlightsCount: data.data.count,
          });

          // Auto-start validation
          setTimeout(() => setStage('validating'), 500);
        } else {
          toast.error(data.error || 'Failed to fetch highlights');
          setStage('idle');
        }
      } catch {
        toast.error('Network error');
        setStage('idle');
      }
    };

    fetchHighlights();
  }, [stage]);

  // Validate highlights
  useEffect(() => {
    if (stage !== 'validating') return;

    const validateData = async () => {
      try {
        const response = await fetch('/api/sync/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            highlights: fetchedData.highlights,
            books: fetchedData.books,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setValidationSummary(data.data);

          // Animate cards moving to validation column
          const validResults = getValidHighlights(data.data);
          const invalidResults = getInvalidHighlights(data.data);

          analytics.validationCompleted({
            total: data.data.total,
            valid: validResults.length,
            invalid: invalidResults.length,
          });

          // Move valid highlights with animation
          validResults.forEach((result, index) => {
            setTimeout(() => {
              setValidatingHighlights((prev) => [...prev, result.highlight]);
              setFetchedHighlights((prev) =>
                prev.filter((h) => h.id !== result.highlight.id)
              );
            }, index * 250); // 250ms delay between each card
          });

          // Keep invalid highlights in Readwise column
          // They stay in fetchedHighlights automatically

          toast.success(
            `Validated: ${validResults.length} valid, ${invalidResults.length} invalid`
          );

          // Auto-start sync after all cards moved
          setTimeout(() => {
            setStage('syncing');
          }, validResults.length * 250 + 1000);
        } else {
          toast.error(data.error || 'Validation failed');
          setStage('idle');
        }
      } catch {
        toast.error('Network error during validation');
        setStage('idle');
      }
    };

    validateData();
  }, [stage]);

  // Sync to Mem
  useEffect(() => {
    if (stage !== 'syncing' || !credentials) return;

    const executeSync = async () => {
      const startTime = Date.now();
      try {
        const validResults = getValidHighlights(validationSummary);

        // Start sync
        const response = await fetch('/api/sync/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            apiKey: credentials.memApiKey,
            validationSummary,
            books: fetchedData.books,
          }),
        });

        const data = await response.json();

        if (data.success) {
          // Animate cards moving to Mem column
          validResults.forEach((result, index) => {
            setTimeout(() => {
              setSyncedHighlights((prev) => [...prev, result.highlight]);
              setValidatingHighlights((prev) =>
                prev.filter((h) => h.id !== result.highlight.id)
              );
            }, index * 250);
          });

          toast.success(`Synced ${data.data.synced} highlights to Mem!`);

          analytics.syncCompleted({
            syncType: syncConfig?.option || 'full',
            totalHighlights: data.data.total,
            syncedCount: data.data.synced,
            errorCount: data.data.errors,
            durationSeconds: Math.round((Date.now() - startTime) / 1000),
          });
          
          setTimeout(() => {
            setStage('complete');
          }, validResults.length * 250 + 1000);
        } else {
          toast.error(data.error || 'Sync failed');
          setStage('idle');
        }
      } catch {
        toast.error('Network error during sync');
        setStage('idle');
      }
    };

    executeSync();
  }, [stage]);

  const isActive = ['fetching', 'validating', 'syncing'].includes(stage);

  return (
    <div className="flex-1 p-8 overflow-hidden" style={{ backgroundColor: memColors.backgroundWarm }}>
  <div className="max-w-7xl mx-auto h-full">
    {!isActive ? (
      <div className="h-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-12 rounded-2xl"
          style={{ backgroundColor: 'white', border: `2px solid ${memColors.gray200}` }}
        >
          <span className="text-6xl mb-4 block">🌉</span>
          <h3 className="text-2xl font-semibold mb-2" style={{ color: memColors.accent }}>
            Ready to Sync
          </h3>
          <p style={{ color: memColors.gray600 }}>
            Connect both services and click `&quot;`Sync Now`&quot;` to begin
          </p>
        </motion.div>
      </div>
    ) : (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-3 gap-6 h-full"
      >
        {/* Columns stay the same */}
            {/* Readwise Column */}
            <KanbanColumn
              title="Readwise"
              icon="📚"
              highlights={fetchedHighlights}
              books={fetchedData.books}
              status="fetched"
              emptyMessage="Highlights will appear here when fetched"
            />

            {/* Validation Column */}
            <KanbanColumn
              title="Validating"
              icon="✓"
              highlights={validatingHighlights}
              books={fetchedData.books}
              status="valid"
              emptyMessage="Valid highlights will move here"
            />

            {/* Mem Column */}
            <KanbanColumn
              title="Mem"
              icon="🧠"
              highlights={syncedHighlights}
              books={fetchedData.books}
              status="synced"
              emptyMessage="Synced highlights will appear here"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}