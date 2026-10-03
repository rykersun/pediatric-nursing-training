import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { StartCourseButton } from "@/components/start-course-button";
import { BilingualText } from "@/components/bilingual-text";
import { JOURNEY_STEPS } from "@/data/journey";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <PageHeader
            eyebrow="Nursing Education"
            title={{
              zh: "兒童注射護理訓練",
              en: "Pediatric Injection Training",
            }}
            description={{
              zh: "結合虛擬人互動、360 度情境與即時回饋，為護理學生打造的臨床溝通與技術訓練平台。",
              en: "A clinical communication and skills platform for nursing students, combining virtual human interaction, 360° scenarios, and real-time feedback.",
            }}
            align="center"
          />
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <StartCourseButton size="lg" />
            <Button href="/journey" variant="secondary">
              瀏覽課程總覽 <span className="text-sm font-normal">Browse Overview</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Learning flow preview */}
      <section className="flex-1 bg-muted-background py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold text-foreground">
              學習旅程 <span className="text-lg font-normal text-muted">Learning Journey</span>
            </h2>
            <p className="mt-2 text-muted">
              六個步驟，從課程介紹到成果回饋
              <span className="ml-2 text-sm">Six steps from introduction to results</span>
            </p>
          </div>

          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {JOURNEY_STEPS.map((step) => (
              <li
                key={step.step}
                className="rounded-xl border border-border bg-white p-6 shadow-sm transition-[border-color,transform] duration-200 ease-out hover:border-primary/30 active:scale-[0.99]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-subtle text-sm font-semibold text-primary">
                    {step.step}
                  </span>
                  <span className="text-xs text-muted">{step.estimatedMinutes} min</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  <BilingualText text={step.title} variant="stacked" />
                </h3>
                <p className="mt-2 text-sm text-muted">
                  <BilingualText text={step.description} />
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted">
              此版本使用 mock data 與 placeholder 內容，未來將串接 Virti 互動模組。
              <br />
              <span className="text-xs">
                This version uses mock data and placeholder content. Virti integration will follow.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-primary py-14 text-primary-foreground">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            準備好開始了嗎？ <span className="text-lg font-normal">Ready to begin?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/90">
            點擊下方按鈕進入課程，逐步完成注射前溝通、技術操作與注射後衛教。
          </p>
          <div className="mt-8">
            <StartCourseButton
              variant="secondary"
              size="lg"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
