'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/stores/auth'

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading, error, clearError } = useAuthStore()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    
    const success = await login(formData.username, formData.password)
    if (success) {
      router.push('/dashboard')
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--muted)',
    }}>
      <div className="apple-card" style={{ width: '100%', maxWidth: '400px', margin: '16px' }}>
        <div className="text-center mb-8">
          <h1 className="mb-2" style={{ fontSize: '28px' }}>登录</h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '15px' }}>
            输入您的用户名和密码
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ 
              padding: '12px', 
              marginBottom: '16px',
              background: 'rgba(255, 59, 48, 0.1)',
              borderRadius: '12px',
              color: '#ff3b30',
              fontSize: '14px',
            }}>
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
              用户名
            </label>
            <input
              type="text"
              className="apple-input"
              placeholder="请输入用户名"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>
          
          <div className="mb-6">
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
              密码
            </label>
            <input
              type="password"
              className="apple-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-primary w-full"
            disabled={isLoading}
            style={{ width: '100%' }}
          >
            {isLoading ? '登录中...' : '登录'}
          </button>
          
          <p className="text-center mt-6" style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
            还没有账号？{' '}
            <Link href="/register" style={{ color: 'var(--primary)' }}>
              立即注册
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}