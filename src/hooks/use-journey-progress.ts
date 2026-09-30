"use client";

import { useSyncExternalStore, useCallback } from "react";
import {
  type JourneyProgress,
  readJourneyProgress,
  subscribeProgress,
  markStepComplete as markStepCompleteLib,
  markStepVisited as markStepVisitedLib,
  clearJourneyProgress,
  invalidateProgressCache,
} from "@/lib/journey-progress";

export function useJourneyProgress() {
  const progress = useSyncExternalStore<JourneyProgress | null>(
    subscribeProgress,
    () => readJourneyProgress(),
    () => null,
  );

  const markStepComplete = useCallback((step: number) => {
    invalidateProgressCache();
    return markStepCompleteLib(step);
  }, []);

  const markStepVisited = useCallback((step: number) => {
    invalidateProgressCache();
    return markStepVisitedLib(step);
  }, []);

  const resetProgress = useCallback(() => {
    invalidateProgressCache();
    clearJourneyProgress();
  }, []);

  return {
    progress,
    hydrated: progress !== null,
    markStepComplete,
    markStepVisited,
    resetProgress,
  };
}
