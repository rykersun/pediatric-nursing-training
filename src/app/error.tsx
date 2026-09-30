"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      <h1 className="text-5xl font-bold text-warning">Oops</h1>
      <h2 className="mt-4 text-2xl font-semibold text-foreground">
        發生錯誤
        <span className="ml-2 text-lg font-normal text-muted">Something went wrong</span>
      </h2>
      <p className="mx-auto mt-4 max-w-md text-muted">
        應用程式發生未預期的錯誤。請嘗試重新整理或清除進度後重新開始。
        <br />
        <span className="text-sm">
          An unexpected error occurred. Try refreshing, or clear your progress and restart.
        </span>
      </p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          重試 <span className="ml-2 text-sm font-normal">Try Again</span>
        </button>
        <Link
          href="/journey"
          className="inline-flex h-12 items-center justify-center rounded-md border border-border bg-white px-6 font-medium text-foreground transition-colors hover:bg-muted-background"
        >
          課程總覽 <span className="ml-2 text-sm font-normal">Overview</span>
        </Link>
      </div>
    </div>
  );
}
