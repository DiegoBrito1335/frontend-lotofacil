import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

interface AuthContextType {
  userId: string | null
  userEmail: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (userId: string, email?: string, isAdmin?: boolean) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(() =>
    localStorage.getItem('user_id')
  )
  const [userEmail, setUserEmail] = useState<string | null>(() =>
    localStorage.getItem('user_email')
  )
  const [isAdmin, setIsAdmin] = useState<boolean>(() =>
    localStorage.getItem('is_admin') === 'true'
  )

  const login = useCallback((id: string, email?: string, admin?: boolean) => {
    localStorage.setItem('user_id', id)
    setUserId(id)
    if (email) {
      localStorage.setItem('user_email', email)
      setUserEmail(email)
    }
    localStorage.setItem('is_admin', admin ? 'true' : 'false')
    setIsAdmin(!!admin)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('user_id')
    localStorage.removeItem('user_email')
    localStorage.removeItem('is_admin')
    setUserId(null)
    setUserEmail(null)
    setIsAdmin(false)
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('user_id')
    if (stored !== userId) {
      setUserId(stored)
    }
  }, [userId])

  return (
    <AuthContext.Provider
      value={{
        userId,
        userEmail,
        isAuthenticated: !!userId,
        isAdmin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}
