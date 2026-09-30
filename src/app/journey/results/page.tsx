"use client";

import { PageHeader } from "@/components/page-header";
import { ResultsSummary } from "@/components/results-summary";
import { useJourneyProgress } from "@/hooks/use-journey-progress";
import { getCompletedSteps } from "@/lib/journey-progress";
import { JOURNEY_STEPS } from "@/data/journey";
import { Button } from "@/components/ui/button";

export default function ResultsPage() {
  const { progress } = useJourneyProgress();
  const completed = new Set(getCompletedSteps(progress));
  const missing = JOURNEY_STEPS.filter((s) => !completed.has(s.step));
  const isComplete = missing.length === 0;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <PageHeader
        title={{
          zh: "成果與回饋",
          en: "Results and Feedback",
        }}
        description={{
          zh: "檢視你的學習完成度與模擬評分。",
          en: "Review your learning completion and simulation scores.",
        }}
      />

      <div className="mt-8">
        {isComplete ? (
          <ResultsSummary />
        ) : (
          <IncompleteResultsPanel missing={missing} />
        )}
      </div>
    </div>
  );
}

function IncompleteResultsPanel({
  missing,
}: {
  missing: typeof JOURNEY_STEPS;
}) {
  return (
    <div className="rounded-xl border border-border bg-white p-8 text-center shadow-sm">
      <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-warning-subtle text-3xl text-warning">
        ⏳
      </div>
      <h2 className="text-xl font-semibold text-foreground">
        尚未完成所有步驟
        <span className="ml-2 text-base font-normal text-muted">
          Not all steps completed
        </span>
      </h2>
      <p className="mx-auto mt-3 max-w-md text-muted">
        請先完成以下步驟，再回來查看完整成果：
        <span className="ml-1 text-sm">
          Please complete these steps before viewing full results:
        </span>
      </p>
      <ul className="mx-auto mt-4 inline-block list-disc pl-5 text-left text-sm text-muted">
        {missing.map((step) => (
          <li key={step.step}>
            {step.title.zh}{" "}
            <span className="text-xs">({step.title.en})</span>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Button href={missing[0].route}>
          繼續課程 <span className="text-sm font-normal">Continue Course</span>
        </Button>
      </div>
    </div>
  );
}
