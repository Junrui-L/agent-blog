import Link from 'next/link'

export function Footer() {
  return (
    <footer style={{ 
      borderTop: '1px solid var(--border)',
      padding: '24px 0',
      marginTop: 'auto',
    }}>
      <div className="container">
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: '16px',
        }}>
          <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
            © 2026 Blog. All rights reserved.
          </p>
          <nav style={{ display: 'flex', gap: '24px' }}>
            <Link href="/about" style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
              关于
            </Link>
            <Link href="/privacy" style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
              隐私政策
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}