import { render, screen, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthProvider, useAuth } from './AuthContext'

vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

import api from '@/services/api'

// Componente auxiliar para expor o contexto via DOM
function TestConsumer() {
  const { isAuthenticated, isLoading, isAdmin, userName, userId } = useAuth()
  return (
    <div>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
      <span data-testid="admin">{String(isAdmin)}</span>
      <span data-testid="username">{userName ?? ''}</span>
      <span data-testid="userid">{userId ?? ''}</span>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  // -----------------------------------------------------------------
  // Estado inicial — isLoading=true enquanto /auth/me está pendente
  // -----------------------------------------------------------------
  it('começa com isLoading=true e isAuthenticated=false', () => {
    vi.mocked(api.get).mockReturnValue(new Promise(() => {})) // nunca resolve
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )
    expect(screen.getByTestId('loading')).toHaveTextContent('true')
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false')
  })

  // -----------------------------------------------------------------
  // /auth/me retorna 401 → não autenticado
  // -----------------------------------------------------------------
  it('isLoading=false e isAuthenticated=false quando /auth/me retorna 401', async () => {
    vi.mocked(api.get).mockRejectedValue({ response: { status: 401 } })
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )
    await waitFor(() =>
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    )
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false')
    expect(screen.getByTestId('userid')).toHaveTextContent('')
  })

  // -----------------------------------------------------------------
  // /auth/me retorna dados válidos → autenticado
  // -----------------------------------------------------------------
  it('autentica e preenche dados quando /auth/me retorna sessão ativa', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: { id: 'user-123', email: 'joao@test.com', nome: 'João', is_admin: false },
    })
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )
    await waitFor(() =>
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    )
    expect(screen.getByTestId('authenticated')).toHaveTextContent('true')
    expect(screen.getByTestId('username')).toHaveTextContent('João')
    expect(screen.getByTestId('userid')).toHaveTextContent('user-123')
    expect(screen.getByTestId('admin')).toHaveTextContent('false')
  })

  // -----------------------------------------------------------------
  // /auth/me com is_admin=true → isAdmin=true
  // -----------------------------------------------------------------
  it('seta isAdmin=true quando is_admin=true no /auth/me', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: { id: 'admin-1', email: 'admin@test.com', nome: 'Admin', is_admin: true },
    })
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )
    await waitFor(() =>
      expect(screen.getByTestId('admin')).toHaveTextContent('true')
    )
  })

  // -----------------------------------------------------------------
  // logout limpa o estado e chama /auth/logout
  // -----------------------------------------------------------------
  it('logout limpa estado e chama POST /auth/logout', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: { id: 'user-123', email: 'joao@test.com', nome: 'João', is_admin: false },
    })
    vi.mocked(api.post).mockResolvedValue({})

    function LogoutConsumer() {
      const { isAuthenticated, logout } = useAuth()
      return (
        <>
          <span data-testid="auth">{String(isAuthenticated)}</span>
          <button onClick={logout}>Sair</button>
        </>
      )
    }

    const { getByRole } = render(
      <AuthProvider>
        <LogoutConsumer />
      </AuthProvider>
    )

    await waitFor(() =>
      expect(screen.getByTestId('auth')).toHaveTextContent('true')
    )

    await act(async () => {
      getByRole('button', { name: 'Sair' }).click()
    })

    expect(screen.getByTestId('auth')).toHaveTextContent('false')
    expect(vi.mocked(api.post)).toHaveBeenCalledWith('/auth/logout')
  })
})
