import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            P
          </span>
          <span className="hidden sm:inline">
            兒童注射護理訓練
            <span className="ml-2 text-sm font-normal text-muted">
              Pediatric Injection Training
            </span>
          </span>
          <span className="sm:hidden">PNT</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/journey"
            className="text-sm font-medium text-muted hover:text-foreground"
          >
            課程總覽 <span className="text-xs">Overview</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
