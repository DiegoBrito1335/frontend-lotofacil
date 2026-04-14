import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
}

export default function SEO({ 
  title, 
  description, 
  image, 
  url 
}: SEOProps) {
  const siteName = 'Bolões Lotofácil'
  const defaultTitle = 'Bolões Lotofácil - Multiplique suas chances'
  const defaultDesc = 'A plataforma mais transparente para participar de bolões da Lotofácil.'
  
  const pageTitle = title ? `${title} | ${siteName}` : defaultTitle
  const pageDesc = description || defaultDesc
  const pageImage = image || '/pwa-512x512.png' // Fallback para ícone do pwa

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDesc} />
      <meta property="og:image" content={pageImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {url && <meta property="twitter:url" content={url} />}
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDesc} />
      <meta name="twitter:image" content={pageImage} />
    </Helmet>
  )
}
