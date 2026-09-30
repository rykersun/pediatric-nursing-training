import { PageHeader } from "@/components/page-header";
import { JourneyStepList } from "@/components/journey-step-list";
import { StartCourseButton } from "@/components/start-course-button";

export default function JourneyOverviewPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          title={{
            zh: "課程總覽",
            en: "Course Overview",
          }}
          description={{
            zh: "依序完成六個步驟，建立與病童及家長的溝通能力與注射技術。",
            en: "Complete the six steps in order to build communication skills and injection technique.",
          }}
        />
        <StartCourseButton />
      </div>

      <JourneyStepList />

      <p className="mx-auto mt-12 max-w-2xl text-center text-sm text-muted">
        進度會儲存在你的瀏覽器中。Progress is saved in your browser.
      </p>
    </div>
  );
}
