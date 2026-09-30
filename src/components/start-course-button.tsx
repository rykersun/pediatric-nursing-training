"use client";

import { Button } from "@/components/ui/button";
import { useJourneyProgress } from "@/hooks/use-journey-progress";
import { getResumeRoute } from "@/lib/journey-progress";

interface StartCourseButtonProps {
  size?: "md" | "lg";
  variant?: "primary" | "secondary";
}

export function StartCourseButton({
  size = "md",
  variant = "primary",
}: StartCourseButtonProps) {
  const { progress } = useJourneyProgress();
  const route = getResumeRoute(progress);

  const isComplete = route === "/journey/results";
  const hasStarted = progress != null && Object.keys(progress.steps).length > 0;

  let labelZh = "開始課程";
  let labelEn = "Start Course";

  if (isComplete) {
    labelZh = "查看成果";
    labelEn = "View Results";
  } else if (hasStarted) {
    labelZh = "繼續課程";
    labelEn = "Resume Course";
  }

  return (
    <Button href={route} variant={variant} size={size}>
      {labelZh} <span className="text-sm font-normal">{labelEn}</span>
    </Button>
  );
}
