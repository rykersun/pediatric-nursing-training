import type { LocalizedText } from "@/data/journey";

interface BilingualTextProps {
  text: LocalizedText;
  variant?: "inline" | "stacked";
  className?: string;
  zhClassName?: string;
  enClassName?: string;
}

export function BilingualText({
  text,
  variant = "inline",
  className = "",
  zhClassName = "",
  enClassName = "",
}: BilingualTextProps) {
  if (variant === "stacked") {
    return (
      <span className={`block ${className}`}>
        <span className={`block ${zhClassName}`}>{text.zh}</span>
        <span
          className={`block text-sm font-normal text-muted ${enClassName}`}
        >
          {text.en}
        </span>
      </span>
    );
  }

  return (
    <span className={`inline-flex flex-wrap items-baseline gap-x-2 ${className}`}>
      <span className={zhClassName}>{text.zh}</span>
      <span className={`text-sm text-muted ${enClassName}`}>{text.en}</span>
    </span>
  );
}
