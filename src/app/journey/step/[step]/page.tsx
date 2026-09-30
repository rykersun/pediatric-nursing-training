import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PlaceholderFrame } from "@/components/placeholder-frame";
import { PrerequisiteGate } from "@/components/prerequisite-gate";
import { MarkCompleteButton } from "@/components/mark-complete-button";
import { getAdjacentSteps, getStep, JOURNEY_STEPS } from "@/data/journey";
import { Button } from "@/components/ui/button";

export function generateStaticParams() {
  return JOURNEY_STEPS.filter((s) => s.step >= 1 && s.step <= 5).map((s) => ({
    step: String(s.step),
  }));
}

export const dynamicParams = false;

interface StepPageProps {
  params: Promise<{ step: string }>;
}

export async function generateMetadata({
  params,
}: StepPageProps): Promise<Metadata> {
  const { step: stepParam } = await params;
  const step = getStep(Number(stepParam));

  return {
    title: step ? `${step.title.zh} ${step.title.en}` : "Step",
  };
}

export default async function StepPage({ params }: StepPageProps) {
  const { step: stepParam } = await params;
  const stepNumber = Number(stepParam);
  const step = getStep(stepNumber);

  if (!step || stepNumber > 5) {
    notFound();
  }

  const { prev, next } = getAdjacentSteps(stepNumber);
  const requires = stepNumber > 1 ? [stepNumber - 1] : [];

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <PageHeader
        eyebrow={`步驟 ${step.step} / STEP ${step.step}`}
        title={step.title}
        description={step.description}
      />

      <div className="mt-8">
        {step.kind === "intro" ? (
          <IntroStepBody step={step} next={next} />
        ) : (
          <PrerequisiteGate requires={requires}>
            <PlaceholderFrame
              step={step.step}
              moduleType={step.virti.moduleType}
              scenarioNote={step.virti.scenarioNote}
              character={step.virti.character}
            />
          </PrerequisiteGate>
        )}
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
        {prev ? (
          <Button href={prev.route} variant="secondary">
            ← 上一步 <span className="text-sm font-normal">Previous</span>
          </Button>
        ) : (
          <span />
        )}
        {next && (
          <Button href={next.route} variant="secondary">
            下一步 <span className="text-sm font-normal">Next</span> →
          </Button>
        )}
      </div>
    </div>
  );
}

import type { JourneyStepConfig } from "@/data/journey";
import { BilingualText } from "@/components/bilingual-text";

function IntroStepBody({
  step,
  next,
}: {
  step: JourneyStepConfig;
  next?: JourneyStepConfig;
}) {
  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">
          學習目標 <span className="text-base font-normal text-muted">Learning Objectives</span>
        </h2>
        <ul className="mt-4 space-y-3">
          {step.learningObjectives.map((objective, index) => (
            <li
              key={index}
              className="flex items-start gap-3 rounded-lg bg-muted-background p-4"
            >
              <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {index + 1}
              </span>
              <p className="text-foreground">
                <BilingualText text={objective} />
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">
          課程說明 <span className="text-base font-normal text-muted">Course Notes</span>
        </h2>
        <p className="mt-3 text-muted">
          本課程將帶領你從注射前的家長溝通、學齡期兒童安撫，到 360 度注射情境操作，最後完成注射後衛教。請依序完成每個步驟，以獲得最完整的學習體驗。
        </p>
        <p className="mt-2 text-sm text-muted">
          This course guides you through pre-injection caregiver communication,
          school-age child calming, a 360° injection scenario, and post-injection health
          education. Complete each step in order for the best learning experience.
        </p>
        <div className="mt-6">
          <MarkCompleteButton
            step={step.step}
            nextRoute={next?.route}
            autoAdvance={!!next}
          />
        </div>
      </div>
    </div>
  );
}
