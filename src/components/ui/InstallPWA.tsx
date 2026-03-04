import { useState, useEffect } from 'react'
import { Download, X, Share2 } from 'lucide-react'

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

function isInStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showIOSBanner, setShowIOSBanner] = useState(false)

  useEffect(() => {
    if (isInStandaloneMode()) return

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)

    if (isIOS()) {
      const dismissed = localStorage.getItem('pwa-ios-dismissed')
      if (!dismissed) setShowIOSBanner(true)
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (deferredPrompt) {
    return (
      <button
        onClick={async () => {
          deferredPrompt.prompt()
          const { outcome } = await deferredPrompt.userChoice
          if (outcome === 'accepted') setDeferredPrompt(null)
        }}
        className="flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
        title="Instalar aplicativo"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Instalar App</span>
      </button>
    )
  }

  if (showIOSBanner) {
    return (
      <div className="fixed bottom-20 left-4 right-4 bg-card border border-border rounded-xl shadow-xl p-4 z-50 flex items-start gap-3">
        <Share2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
        <div className="flex-1 text-sm">
          <p className="font-semibold mb-1">Instalar o App</p>
          <p className="text-text-muted text-xs leading-relaxed">
            Toque em <strong>Compartilhar</strong> <Share2 className="w-3 h-3 inline align-baseline" /> no Safari e depois em{' '}
            <strong>"Adicionar à Tela de Início"</strong>
          </p>
        </div>
        <button
          onClick={() => {
            localStorage.setItem('pwa-ios-dismissed', '1')
            setShowIOSBanner(false)
          }}
          className="text-text-muted hover:text-text transition-colors"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return null
}
