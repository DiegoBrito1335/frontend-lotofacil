import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import Layout from '@/components/Layout'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import HomePage from '@/pages/HomePage'
import BolaoDetalhesPage from '@/pages/BolaoDetalhesPage'
import MinhasCotasPage from '@/pages/MinhasCotasPage'
import CarteiraPage from '@/pages/CarteiraPage'
import DepositarPage from '@/pages/DepositarPage'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminBoloesPage from '@/pages/admin/AdminBoloesPage'
import AdminCriarBolaoPage from '@/pages/admin/AdminCriarBolaoPage'
import AdminEditarBolaoPage from '@/pages/admin/AdminEditarBolaoPage'
import type { ReactNode } from 'react'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      {/* Páginas standalone (sem Layout) */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Páginas com Layout (header + footer) */}
      <Route element={<Layout />}>
        <Route path="/boloes" element={<HomePage />} />
        <Route path="/bolao/:id" element={<BolaoDetalhesPage />} />
        <Route
          path="/minhas-cotas"
          element={<ProtectedRoute><MinhasCotasPage /></ProtectedRoute>}
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
          path="/admin"
          element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}
        />
        <Route
          path="/admin/boloes"
          element={<ProtectedRoute><AdminBoloesPage /></ProtectedRoute>}
        />
        <Route
          path="/admin/boloes/novo"
          element={<ProtectedRoute><AdminCriarBolaoPage /></ProtectedRoute>}
        />
        <Route
          path="/admin/boloes/:id"
          element={<ProtectedRoute><AdminEditarBolaoPage /></ProtectedRoute>}
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
