import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import api from '@/services/api'

interface UserInfo {
  id: string
  nome: string
  email: string
  is_admin: boolean
}

interface AuthContextType {
  userId: string | null
  userEmail: string | null
  userName: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  login: (data: UserInfo) => void
  logout: () => Promise<void>
  updateUserName: (nome: string) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(() =>
    localStorage.getItem('user_name')
  )
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Ao carregar o app, verifica sessão ativa via cookie httpOnly
  useEffect(() => {
    api.get('/auth/me')
      .then(({ data }) => {
        setUserId(data.id)
        setUserEmail(data.email)
        setIsAdmin(data.is_admin)
        setUserName(data.nome || localStorage.getItem('user_name'))
      })
      .catch(() => {
        // Cookie inexistente ou expirado — usuário não autenticado
      })
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback((data: UserInfo) => {
    setUserId(data.id)
    setUserEmail(data.email)
    setIsAdmin(data.is_admin)
    setUserName(data.nome)
    localStorage.setItem('user_name', data.nome)
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // Ignorar erro de rede — limpa estado de qualquer forma
    }
    setUserId(null)
    setUserEmail(null)
    setIsAdmin(false)
    setUserName(null)
    localStorage.removeItem('user_name')
  }, [])

  const updateUserName = useCallback((nome: string) => {
    localStorage.setItem('user_name', nome)
    setUserName(nome)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        userId,
        userEmail,
        userName,
        isAuthenticated: !!userId,
        isAdmin,
        isLoading,
        login,
        logout,
        updateUserName,
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
