'use client'

import Link from 'next/link'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'

export function Header() {
  const { isAuthenticated, user, logout } = useAuthStore()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          Blog
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:underline">
            首页
          </Link>
          <Link href="/posts" className="text-sm font-medium hover:underline">
            文章
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user?.username}
              </span>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">后台</Button>
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>
                退出
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">登录</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">注册</Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}