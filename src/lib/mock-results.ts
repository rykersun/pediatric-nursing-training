import type { JourneyProgress } from "@/lib/journey-progress";
import { getCompletedSteps } from "@/lib/journey-progress";
import { JOURNEY_STEPS } from "@/data/journey";

export const PASS_MARK = 80;

export const MOCK_STEP_SCORES: Record<number, number> = {
  1: 100,
  2: 88,
  3: 82,
  4: 76,
  5: 90,
};

export interface StepResult {
  step: number;
  score: number;
  passed: boolean;
  timeSpentSeconds: number;
}

export interface SessionResult {
  overallScore: number;
  completedSteps: number;
  totalSteps: number;
  stepResults: StepResult[];
  totalSeconds: number;
  allPassed: boolean;
}

export function buildSessionResult(progress: JourneyProgress | null): SessionResult {
  const completed = getCompletedSteps(progress);
  const stepResults = completed.map((stepNumber) => {
    const stepProgress = progress?.steps[stepNumber];
    const previousStep = JOURNEY_STEPS.find((s) => s.step === stepNumber - 1);
    const previousCompletedAt = previousStep
      ? progress?.steps[previousStep.step]?.completedAt
      : progress?.updatedAt;

    let timeSpentSeconds = 0;
    if (stepProgress?.completedAt && previousCompletedAt) {
      timeSpentSeconds = Math.max(
        0,
        Math.round(
          (new Date(stepProgress.completedAt).getTime() -
            new Date(previousCompletedAt).getTime()) /
            1000,
        ),
      );
    }

    // Fallback to estimated duration if we cannot compute a reasonable delta.
    const stepConfig = JOURNEY_STEPS.find((s) => s.step === stepNumber);
    if (timeSpentSeconds === 0 && stepConfig) {
      timeSpentSeconds = stepConfig.estimatedMinutes * 60;
    }

    const score = MOCK_STEP_SCORES[stepNumber] ?? 0;

    return {
      step: stepNumber,
      score,
      passed: score >= PASS_MARK,
      timeSpentSeconds,
    };
  });

  const totalSeconds = stepResults.reduce(
    (sum, result) => sum + result.timeSpentSeconds,
    0,
  );

  const overallScore =
    stepResults.length > 0
      ? Math.round(
          stepResults.reduce((sum, r) => sum + r.score, 0) / stepResults.length,
        )
      : 0;

  return {
    overallScore,
    completedSteps: stepResults.length,
    totalSteps: JOURNEY_STEPS.length,
    stepResults,
    totalSeconds,
    allPassed: stepResults.length > 0 && stepResults.every((r) => r.passed),
  };
}

export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds} 秒 / ${seconds}s`;
  return `${minutes} 分 ${seconds} 秒 / ${minutes}m ${seconds}s`;
}
