import { ProgressTracker } from "@/components/progress-tracker";

export default function JourneyLayout({ children }: LayoutProps<"/journey">) {
  return (
    <div className="flex min-h-full flex-col bg-muted-background">
      <ProgressTracker />
      <div className="flex-1">{children}</div>
    </div>
  );
}
