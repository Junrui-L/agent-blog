'use client'

import Link from 'next/link'
import { useAuthStore } from '@/stores/auth'
import { SearchBar } from '@/components/search/SearchBar'

export function Header() {
  const { isAuthenticated, user, logout } = useAuthStore()

  return (
    <header style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 50, 
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'saturate(180%) blur(20px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div className="container">
        <nav style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          height: '48px',
        }}>
          <Link href="/" style={{ 
            fontSize: '21px', 
            fontWeight: 600, 
            color: 'var(--foreground)',
            letterSpacing: '-0.01em',
          }}>
            Blog
          </Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link href="/" style={{ fontSize: '14px', color: 'var(--foreground)', opacity: 0.8 }}>
              首页
            </Link>
            <Link href="/posts" style={{ fontSize: '14px', color: 'var(--foreground)', opacity: 0.8 }}>
              文章
            </Link>
            
            {/* 搜索栏 */}
            <SearchBar />
            
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
                  {user?.username}
                </span>
                <Link href="/dashboard">
                  <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }}>
                    后台
                  </button>
                </Link>
                <button 
                  onClick={logout}
                  style={{ 
                    fontSize: '14px', 
                    color: 'var(--primary)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  退出
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link href="/login">
                  <button style={{ 
                    fontSize: '14px', 
                    color: 'var(--primary)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}>
                    登录
                  </button>
                </Link>
                <Link href="/register">
                  <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }}>
                    注册
                  </button>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}