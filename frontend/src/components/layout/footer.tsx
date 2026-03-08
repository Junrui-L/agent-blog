import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-muted-foreground">
          © 2026 Blog. All rights reserved.
        </p>
        <nav className="flex gap-4">
          <Link href="/about" className="text-sm text-muted-foreground hover:underline">
            关于
          </Link>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
            隐私政策
          </Link>
        </nav>
      </div>
    </footer>
  )
}