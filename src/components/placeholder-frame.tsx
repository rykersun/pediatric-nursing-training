"use client";

import { useEffect, useState } from "react";
import type { VirtiModuleType } from "@/data/journey";
import { BilingualText } from "@/components/bilingual-text";
import type { LocalizedText } from "@/data/journey";
import { MarkCompleteButton } from "@/components/mark-complete-button";

interface PlaceholderFrameProps {
  step: number;
  moduleType: VirtiModuleType;
  scenarioNote: LocalizedText;
  character?: { name: LocalizedText; role: LocalizedText };
}

const SIMULATION_DURATION_MS = 2500;

export function PlaceholderFrame({
  step,
  moduleType,
  scenarioNote,
  character,
}: PlaceholderFrameProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;

    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const next = Math.min((elapsed / SIMULATION_DURATION_MS) * 100, 100);
      setProgress(next);

      if (next >= 100) {
        clearInterval(interval);
        setFinished(true);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-border bg-muted-background px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-primary" />
          <span className="text-sm font-medium text-foreground">
            {getModuleLabel(moduleType)}
          </span>
        </div>
        <span className="text-xs text-muted">
          Virti Placeholder · Not integrated yet
        </span>
      </div>

      <div className="relative flex aspect-video flex-col items-center justify-center bg-slate-50 p-8 text-center">
        {!isPlaying ? (
          <>
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-subtle text-3xl text-primary">
              ▶
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              {character ? (
                <BilingualText
                  text={{
                    zh: `與 ${character.name.zh} 互動`,
                    en: `Interact with ${character.name.en}`,
                  }}
                />
              ) : (
                <BilingualText
                  text={{ zh: "模擬情境", en: "Simulation Scenario" }}
                />
              )}
            </h3>
            {character && (
              <p className="mt-1 text-sm text-muted">
                <BilingualText text={character.role} />
              </p>
            )}
            <p className="mx-auto mt-4 max-w-md text-sm text-muted">
              <BilingualText text={scenarioNote} />
            </p>
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              className="mt-6 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              開始模擬 <span className="font-normal">Start Simulation</span>
            </button>
          </>
        ) : (
          <>
            <div className="mb-6 text-lg font-medium text-foreground">
              模擬進行中…{" "}
              <span className="text-sm text-muted">Simulation in progress…</span>
            </div>
            <div className="h-2 w-full max-w-md overflow-hidden rounded-full bg-border">
              <div
                className="h-full bg-primary transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-4 text-sm text-muted">
              實際上線後，此處將嵌入 Virti 互動模組。
              <br />
              When live, this area will embed the Virti interactive module.
            </p>
          </>
        )}
      </div>

      {finished && (
        <div className="flex flex-col items-center gap-4 border-t border-border bg-success-subtle px-6 py-6 text-center">
          <p className="text-sm font-medium text-success">
            模擬完成 Simulation complete
          </p>
          <MarkCompleteButton step={step} />
        </div>
      )}
    </div>
  );
}

function getModuleLabel(moduleType: VirtiModuleType) {
  switch (moduleType) {
    case "virtual-human":
      return "Virtual Human";
    case "interactive-video":
      return "Interactive Video";
    case "360-scenario":
      return "360° Scenario";
    default:
      return "Virti Module";
  }
}
