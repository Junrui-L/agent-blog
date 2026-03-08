import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi, type AuthResponse } from '@/lib/api'

interface User {
  id: string
  username: string
  email: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  clearError: () => void
  setTokens: (tokens: AuthResponse) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null })
        
        const response = await authApi.login({ username, password })
        
        if (response.error) {
          set({ isLoading: false, error: response.error })
          return false
        }
        
        if (response.data) {
          const { accessToken, refreshToken } = response.data
          localStorage.setItem('accessToken', accessToken)
          
          set({
            user: { id: '', username, email: '' },
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          })
          return true
        }
        
        set({ isLoading: false })
        return false
      },

      register: async (username: string, email: string, password: string) => {
        set({ isLoading: true, error: null })
        
        const response = await authApi.register({ username, email, password })
        
        if (response.error) {
          set({ isLoading: false, error: response.error })
          return false
        }
        
        if (response.data) {
          const { accessToken, refreshToken } = response.data
          localStorage.setItem('accessToken', accessToken)
          
          set({
            user: { id: '', username, email },
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          })
          return true
        }
        
        set({ isLoading: false })
        return false
      },

      logout: () => {
        localStorage.removeItem('accessToken')
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        })
      },

      clearError: () => set({ error: null }),

      setTokens: (tokens: AuthResponse) => {
        localStorage.setItem('accessToken', tokens.accessToken)
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)