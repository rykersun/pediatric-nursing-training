import type { Route } from "next";
import { getFirstIncompleteStep, JOURNEY_STEPS } from "@/data/journey";

export interface JourneyProgress {
  version: 1;
  steps: Partial<Record<number, { completedAt: string }>>;
  lastStepVisited: number | null;
  updatedAt: string;
}

export const JOURNEY_PROGRESS_KEY = "pnt.journey.v1";

export type StepStatus = "completed" | "current" | "locked" | "upcoming";

let cachedProgress: JourneyProgress | null | undefined;

function createEmptyProgress(): JourneyProgress {
  return {
    version: 1,
    steps: {},
    lastStepVisited: null,
    updatedAt: new Date().toISOString(),
  };
}

export function readJourneyProgress(): JourneyProgress | null {
  if (typeof window === "undefined") return null;
  if (cachedProgress !== undefined) return cachedProgress;

  try {
    const raw = window.localStorage.getItem(JOURNEY_PROGRESS_KEY);
    if (!raw) {
      cachedProgress = null;
      return null;
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!isValidProgress(parsed)) {
      cachedProgress = null;
      return null;
    }
    cachedProgress = parsed;
    return parsed;
  } catch {
    cachedProgress = null;
    return null;
  }
}

export function writeJourneyProgress(progress: JourneyProgress): void {
  if (typeof window === "undefined") return;
  const normalized = {
    ...progress,
    updatedAt: new Date().toISOString(),
  };
  cachedProgress = normalized;
  window.localStorage.setItem(JOURNEY_PROGRESS_KEY, JSON.stringify(normalized));
  notifyListeners();
}

export function clearJourneyProgress(): void {
  if (typeof window === "undefined") return;
  cachedProgress = createEmptyProgress();
  window.localStorage.setItem(
    JOURNEY_PROGRESS_KEY,
    JSON.stringify(cachedProgress),
  );
  notifyListeners();
}

export function markStepComplete(step: number): JourneyProgress {
  const current = readJourneyProgress() ?? createEmptyProgress();
  const next: JourneyProgress = {
    ...current,
    steps: {
      ...current.steps,
      [step]: { completedAt: new Date().toISOString() },
    },
  };
  writeJourneyProgress(next);
  return next;
}

export function markStepVisited(step: number): JourneyProgress {
  const current = readJourneyProgress() ?? createEmptyProgress();
  const next: JourneyProgress = {
    ...current,
    lastStepVisited: step,
  };
  writeJourneyProgress(next);
  return next;
}

export function getCompletedSteps(progress: JourneyProgress | null): number[] {
  if (!progress) return [];
  return JOURNEY_STEPS.filter((s) => progress.steps[s.step] != null).map(
    (s) => s.step,
  );
}

export function getStepStatuses(
  progress: JourneyProgress | null,
): Record<number, StepStatus> {
  const completed = new Set(getCompletedSteps(progress));
  const currentStep = getFirstIncompleteStep(completed).step;

  return JOURNEY_STEPS.reduce<Record<number, StepStatus>>((acc, step) => {
    if (completed.has(step.step)) {
      acc[step.step] = "completed";
    } else if (step.step === currentStep) {
      acc[step.step] = "current";
    } else if (step.step < currentStep) {
      acc[step.step] = "upcoming";
    } else {
      acc[step.step] = "locked";
    }
    return acc;
  }, {});
}

export function getResumeRoute(progress: JourneyProgress | null): Route {
  const completed = new Set(getCompletedSteps(progress));
  const allCompleted = JOURNEY_STEPS.every((s) => completed.has(s.step));

  if (allCompleted) return "/journey/results";

  const firstIncomplete = getFirstIncompleteStep(completed);
  return firstIncomplete.route;
}

function isValidProgress(value: unknown): value is JourneyProgress {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<JourneyProgress>;
  return candidate.version === 1 && typeof candidate.steps === "object";
}

// --- Subscription mechanism for same-tab updates ---

type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeProgress(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export function invalidateProgressCache(): void {
  cachedProgress = undefined;
}
