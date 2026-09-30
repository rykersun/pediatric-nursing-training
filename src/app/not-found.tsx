import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-foreground">
        找不到頁面
        <span className="ml-2 text-lg font-normal text-muted">Page Not Found</span>
      </h2>
      <p className="mx-auto mt-4 max-w-md text-muted">
        你試圖存取的頁面不存在。請回到首頁或課程總覽。
        <br />
        <span className="text-sm">
          The page you are looking for does not exist. Return to the homepage or course overview.
        </span>
      </p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          回首頁 <span className="ml-2 text-sm font-normal">Home</span>
        </Link>
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
