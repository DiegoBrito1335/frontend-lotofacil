import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import SEO from '@/components/SEO'

export default function NotFoundPage() {
  return (
    <>
      <SEO 
        title="Página não encontrada" 
        description="A página que você procurava não existe ou foi removida." 
      />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="max-w-md w-full space-y-8 text-center bg-white p-10 rounded-2xl shadow-xl">
          <div className="flex justify-center">
            <AlertTriangle className="h-24 w-24 text-yellow-500" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Erro 404
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ops! A página que você está procurando não existe, foi removida ou o link está quebrado.
          </p>
          <div className="mt-8">
            <Link
              to="/"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              Voltar para a Página Inicial
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
