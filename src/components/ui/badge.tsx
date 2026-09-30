import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "muted";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";

  const variants = {
    default: "bg-primary-subtle text-primary",
    success: "bg-success-subtle text-success",
    warning: "bg-warning-subtle text-warning",
    muted: "bg-muted-background text-muted",
  };

  return <span className={`${base} ${variants[variant]} ${className}`}>{children}</span>;
}
