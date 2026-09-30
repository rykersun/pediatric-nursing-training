import Link from "next/link";
import type { ReactNode } from "react";

interface ButtonBaseProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  className?: string;
}

type ButtonAsButtonProps = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: undefined;
  };

type ButtonAsLinkProps = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    href: string;
  };

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    secondary:
      "bg-white text-foreground border border-border hover:bg-muted-background",
    ghost: "text-foreground hover:bg-muted-background",
  };

  const sizes = {
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if ("href" in rest && rest.href) {
    const { href, ...linkRest } = rest;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonAsButtonProps)}>
      {children}
    </button>
  );
}
