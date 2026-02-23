import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface AuthContextType {
  userId: string | null
  userEmail: string | null
  userName: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (token: string, nome?: string) => void
  logout: () => void
  updateUserName: (nome: string) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

/** Decodifica o payload de um JWT sem verificar assinatura (verificação é responsabilidade do backend). */
function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
  } catch {
    return null
  }
}

function getInitialState() {
  const token = localStorage.getItem('auth_token')
  if (!token) return { token: null, userId: null, userEmail: null, isAdmin: false }
  const payload = decodeJwt(token)
  if (!payload) return { token: null, userId: null, userEmail: null, isAdmin: false }
  // Verificar expiração no cliente também (evita requests desnecessários)
  const exp = payload.exp as number | undefined
  if (exp && Date.now() / 1000 > exp) {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_name')
    return { token: null, userId: null, userEmail: null, isAdmin: false }
  }
  return {
    token,
    userId: payload.sub as string,
    userEmail: payload.email as string,
    isAdmin: !!payload.is_admin,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const initial = getInitialState()

  const [authToken, setAuthToken] = useState<string | null>(initial.token)
  const [userId, setUserId] = useState<string | null>(initial.userId)
  const [userEmail, setUserEmail] = useState<string | null>(initial.userEmail)
  const [userName, setUserName] = useState<string | null>(() =>
    localStorage.getItem('user_name')
  )
  const [isAdmin, setIsAdmin] = useState<boolean>(initial.isAdmin)

  const login = useCallback((token: string, nome?: string) => {
    const payload = decodeJwt(token)
    if (!payload) return

    localStorage.setItem('auth_token', token)
    if (nome) localStorage.setItem('user_name', nome)

    setAuthToken(token)
    setUserId(payload.sub as string)
    setUserEmail(payload.email as string)
    setIsAdmin(!!payload.is_admin)
    if (nome) setUserName(nome)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_name')
    setAuthToken(null)
    setUserId(null)
    setUserEmail(null)
    setUserName(null)
    setIsAdmin(false)
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
        isAuthenticated: !!authToken,
        isAdmin,
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
