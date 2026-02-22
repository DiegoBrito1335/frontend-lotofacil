import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import Layout from '@/components/Layout'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import HomePage from '@/pages/HomePage'
import BolaoDetalhesPage from '@/pages/BolaoDetalhesPage'
import MinhasCotasPage from '@/pages/MinhasCotasPage'
import ResultadosPage from '@/pages/ResultadosPage'
import CarteiraPage from '@/pages/CarteiraPage'
import DepositarPage from '@/pages/DepositarPage'
import ComoJogarPage from '@/pages/ComoJogarPage'
import RegrasPage from '@/pages/RegrasPage'
import PerfilPage from '@/pages/PerfilPage'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminBoloesPage from '@/pages/admin/AdminBoloesPage'
import AdminCriarBolaoPage from '@/pages/admin/AdminCriarBolaoPage'
import AdminEditarBolaoPage from '@/pages/admin/AdminEditarBolaoPage'
import ForgotPasswordPage from '@/pages/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/ResetPasswordPage'
import ConfirmarEmailPage from '@/pages/ConfirmarEmailPage'
import type { ReactNode } from 'react'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AdminRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/boloes" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      {/* Páginas standalone (sem Layout) */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/esqueceu-senha" element={<ForgotPasswordPage />} />
      <Route path="/redefinir-senha" element={<ResetPasswordPage />} />
      <Route path="/confirmar-email" element={<ConfirmarEmailPage />} />

      {/* Páginas com Layout (header + footer) */}
      <Route element={<Layout />}>
        <Route path="/boloes" element={<HomePage />} />
        <Route path="/bolao/:id" element={<BolaoDetalhesPage />} />
        <Route path="/como-jogar" element={<ComoJogarPage />} />
        <Route path="/regras" element={<RegrasPage />} />
        <Route
          path="/minhas-cotas"
          element={<ProtectedRoute><MinhasCotasPage /></ProtectedRoute>}
        />
        <Route
          path="/resultados"
          element={<ProtectedRoute><ResultadosPage /></ProtectedRoute>}
        />
        <Route
          path="/carteira"
          element={<ProtectedRoute><CarteiraPage /></ProtectedRoute>}
        />
        <Route
          path="/depositar"
          element={<ProtectedRoute><DepositarPage /></ProtectedRoute>}
        />
        <Route
          path="/perfil"
          element={<ProtectedRoute><PerfilPage /></ProtectedRoute>}
        />
        <Route
          path="/admin"
          element={<AdminRoute><AdminDashboard /></AdminRoute>}
        />
        <Route
          path="/admin/boloes"
          element={<AdminRoute><AdminBoloesPage /></AdminRoute>}
        />
        <Route
          path="/admin/boloes/novo"
          element={<AdminRoute><AdminCriarBolaoPage /></AdminRoute>}
        />
        <Route
          path="/admin/boloes/:id"
          element={<AdminRoute><AdminEditarBolaoPage /></AdminRoute>}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
