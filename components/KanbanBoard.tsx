'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePipelineStore } from '@/store/pipelineStore';
import { ReadwiseHighlight } from '@/types/readwise';
import { ValidationResult } from '@/types/pipeline';
import { getValidHighlights, getInvalidHighlights } from '@/lib/validation';
import KanbanColumn from './KanbanColumn';
import toast from 'react-hot-toast';

export default function KanbanBoard() {
  const {
    credentials,
    syncConfig,
    stage,
    fetchedData,
    validationSummary,
    syncProgress,
    setFetchProgress,
    setFetchedData,
    setValidationSummary,
    setSyncProgress,
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
          
          // Auto-start validation
          setTimeout(() => setStage('validating'), 500);
        } else {
          toast.error(data.error || 'Failed to fetch highlights');
          setStage('idle');
        }
      } catch (error) {
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
      } catch (error) {
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
          
          setTimeout(() => {
            setStage('complete');
          }, validResults.length * 250 + 1000);
        } else {
          toast.error(data.error || 'Sync failed');
          setStage('idle');
        }
      } catch (error) {
        toast.error('Network error during sync');
        setStage('idle');
      }
    };

    executeSync();
  }, [stage]);

  const isActive = ['fetching', 'validating', 'syncing'].includes(stage);

  return (
    <div className="flex-1 bg-gray-100 p-8 overflow-hidden">
      <div className="max-w-7xl mx-auto h-full">
        {!isActive ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <span className="text-6xl mb-4 block">🌉</span>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Ready to Sync
              </h3>
              <p className="text-gray-500">
                Connect both services and click `&quot;`Sync Now`&quot;` to begin
              </p>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-6 h-full"
          >
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