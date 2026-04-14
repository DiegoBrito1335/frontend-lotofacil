import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import Layout from '@/components/Layout'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import HomePage from '@/pages/HomePage'
import ComoJogarPage from '@/pages/ComoJogarPage'
import RegrasPage from '@/pages/RegrasPage'
import ForgotPasswordPage from '@/pages/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/ResetPasswordPage'
import ConfirmarEmailPage from '@/pages/ConfirmarEmailPage'
import PoliticaPrivacidadePage from '@/pages/PoliticaPrivacidadePage'
import TermosUsoPage from '@/pages/TermosUsoPage'
import { GoogleOAuthProvider } from '@react-oauth/google'
import type { ReactNode } from 'react'
import { Suspense, lazy } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import NotFoundPage from '@/pages/NotFoundPage'
import { Loader2 } from 'lucide-react'
import { Navigate } from 'react-router-dom'

// Lazy Loading das rotas protegidas e pesadas
const BolaoDetalhesPage = lazy(() => import('@/pages/BolaoDetalhesPage'))
const MinhasCotasPage = lazy(() => import('@/pages/MinhasCotasPage'))
const ResultadosPage = lazy(() => import('@/pages/ResultadosPage'))
const CarteiraPage = lazy(() => import('@/pages/CarteiraPage'))
const DepositarPage = lazy(() => import('@/pages/DepositarPage'))
const PerfilPage = lazy(() => import('@/pages/PerfilPage'))

// Rotas Administrativas
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))
const AdminBoloesPage = lazy(() => import('@/pages/admin/AdminBoloesPage'))
const AdminCriarBolaoPage = lazy(() => import('@/pages/admin/AdminCriarBolaoPage'))
const AdminEditarBolaoPage = lazy(() => import('@/pages/admin/AdminEditarBolaoPage'))
const AdminUsuariosPage = lazy(() => import('@/pages/admin/AdminUsuariosPage'))

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AdminRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()
  if (isLoading) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/boloes" replace />
  return <>{children}</>
}

function PageLoader() {
  return (
    <div className="flex justify-center items-center h-[50vh]">
      <Loader2 className="w-10 h-10 animate-spin text-green-600" />
    </div>
  )
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
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
        <Route path="/politica-de-privacidade" element={<PoliticaPrivacidadePage />} />
        <Route path="/termos-de-uso" element={<TermosUsoPage />} />
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
        <Route
          path="/admin/usuarios"
          element={<AdminRoute><AdminUsuariosPage /></AdminRoute>}
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </Suspense>
  )
}

export default function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

  return (
    <HelmetProvider>
      <GoogleOAuthProvider clientId={clientId}>
        <BrowserRouter>
          <AuthProvider>
            <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </HelmetProvider>
  )
}
