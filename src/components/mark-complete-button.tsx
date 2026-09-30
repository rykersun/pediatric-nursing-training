"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useJourneyProgress } from "@/hooks/use-journey-progress";
import { getAdjacentSteps } from "@/data/journey";

interface MarkCompleteButtonProps {
  step: number;
  nextRoute?: string;
  autoAdvance?: boolean;
}

export function MarkCompleteButton({
  step,
  nextRoute,
  autoAdvance = true,
}: MarkCompleteButtonProps) {
  const router = useRouter();
  const { markStepComplete } = useJourneyProgress();

  const handleClick = () => {
    markStepComplete(step);

    if (autoAdvance) {
      const target = nextRoute ?? getAdjacentSteps(step).next?.route;
      if (target) {
        router.push(target);
      }
    }
  };

  return (
    <Button onClick={handleClick} size="lg">
      完成此步驟 <span className="text-sm font-normal">Mark Complete</span>
    </Button>
  );
}
