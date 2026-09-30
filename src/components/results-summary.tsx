"use client";

import { useRouter } from "next/navigation";
import { useJourneyProgress } from "@/hooks/use-journey-progress";
import { buildSessionResult, formatDuration, PASS_MARK } from "@/lib/mock-results";
import { JOURNEY_STEPS } from "@/data/journey";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BilingualText } from "@/components/bilingual-text";

export function ResultsSummary() {
  const { progress, resetProgress } = useJourneyProgress();
  const router = useRouter();
  const result = buildSessionResult(progress);

  const handleRestart = () => {
    if (confirm("確定要重新開始課程嗎？All progress will be reset.")) {
      resetProgress();
      router.push("/journey/step/1");
    }
  };

  return (
    <div className="space-y-8">
      {/* Overall score */}
      <div className="rounded-xl border border-border bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">
          整體表現 <span className="text-base font-normal text-muted">Overall Performance</span>
        </h2>
        <div className="mt-4 inline-flex h-28 w-28 items-center justify-center rounded-full bg-primary-subtle">
          <span className="text-4xl font-bold text-primary">{result.overallScore}</span>
          <span className="ml-0.5 text-lg text-primary">/100</span>
        </div>
        <div className="mt-4">
          <Badge variant={result.allPassed ? "success" : "warning"}>
            {result.allPassed ? "全部通過 All Passed" : "部分項目需加強 Keep Practicing"}
          </Badge>
        </div>
        <p className="mt-4 text-sm text-muted">
          總耗時 Total time: {formatDuration(result.totalSeconds)}
        </p>
      </div>

      {/* Per-step breakdown */}
      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">
          各步驟評分 <span className="text-base font-normal text-muted">Step Breakdown</span>
        </h2>
        <div className="mt-6 space-y-5">
          {result.stepResults.map((stepResult) => {
            const step = JOURNEY_STEPS.find((s) => s.step === stepResult.step);
            if (!step) return null;

            return (
              <div key={stepResult.step}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">
                    {step.title.zh}{" "}
                    <span className="text-xs text-muted">({step.title.en})</span>
                  </span>
                  <span
                    className={`font-semibold ${
                      stepResult.passed ? "text-success" : "text-warning"
                    }`}
                  >
                    {stepResult.score}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-border">
                  <div
                    className={`h-full rounded-full ${
                      stepResult.passed ? "bg-success" : "bg-warning"
                    }`}
                    style={{ width: `${stepResult.score}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted">
                  耗時 {formatDuration(stepResult.timeSpentSeconds)}
                  {stepResult.passed
                    ? ` · 通過 Passed (≥${PASS_MARK})`
                    : ` · 未通過 Not Passed (<${PASS_MARK})`}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feedback */}
      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">
          回饋建議 <span className="text-base font-normal text-muted">Feedback</span>
        </h2>
        <p className="mt-3 text-muted">
          <BilingualText
            text={{
              zh: getFeedbackZh(result),
              en: getFeedbackEn(result),
            }}
          />
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button onClick={handleRestart} variant="secondary" className="flex-1">
          重新開始 <span className="text-sm font-normal">Restart Course</span>
        </Button>
        <Button href="/journey" variant="ghost" className="flex-1">
          返回課程總覽 <span className="text-sm font-normal">Back to Overview</span>
        </Button>
      </div>
    </div>
  );
}

function getFeedbackZh(result: ReturnType<typeof buildSessionResult>): string {
  if (result.completedSteps === 0) return "尚未完成任何步驟。";
  if (result.allPassed) return "表現優秀！你已掌握兒童注射的核心溝通與技術流程。";
  const lowSteps = result.stepResults
    .filter((r) => !r.passed)
    .map((r) => JOURNEY_STEPS.find((s) => s.step === r.step)?.title.zh)
    .filter(Boolean);
  return `建議複習以下步驟：${lowSteps.join("、")}。`;
}

function getFeedbackEn(result: ReturnType<typeof buildSessionResult>): string {
  if (result.completedSteps === 0) return "No steps completed yet.";
  if (result.allPassed)
    return "Excellent work! You have mastered the core communication and technical flow.";
  const lowSteps = result.stepResults
    .filter((r) => !r.passed)
    .map((r) => JOURNEY_STEPS.find((s) => s.step === r.step)?.title.en)
    .filter(Boolean);
  return `Consider reviewing: ${lowSteps.join(", ")}.`;
}
