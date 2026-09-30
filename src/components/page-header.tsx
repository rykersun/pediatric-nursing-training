import { BilingualText } from "@/components/bilingual-text";
import type { LocalizedText } from "@/data/journey";

interface PageHeaderProps {
  eyebrow?: string;
  title: LocalizedText;
  description?: LocalizedText;
  align?: "left" | "center";
}

export function PageHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: PageHeaderProps) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">
          {eyebrow}
        </p>
      )}
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        <BilingualText text={title} variant="stacked" />
      </h1>
      {description && (
        <p className="mt-4 text-lg text-muted">
          <BilingualText text={description} />
        </p>
      )}
    </div>
  );
}
