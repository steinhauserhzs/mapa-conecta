import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export const SEO = ({
  title = "Jé Fêrraz Numerologia - Plataforma Completa de Numerologia Cabalística",
  description = "Descubra os segredos do seu destino através da Numerologia Cabalística. Mapas completos, análises personalizadas e relatórios profissionais. Mais de 10.000 mapas criados com precisão garantida.",
  keywords = "numerologia, numerologia cabalística, mapa numerológico, análise numerológica, números cabalísticos, destino, personalidade, compatibilidade, numerologia online, relatórios numerológicos",
  image = "/hero-numerology.jpg",
  url = "https://jeferraz-numerologia.lovable.app",
  type = "website"
}: SEOProps) => {
  const fullTitle = title.includes("Jé Fêrraz") ? title : `${title} | Jé Fêrraz Numerologia`;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Jé Fêrraz" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Language and Character Set */}
      <meta httpEquiv="Content-Language" content="pt-br" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Jé Fêrraz Numerologia" />
      <meta property="og:locale" content="pt_BR" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#8b5cf6" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Jé Fêrraz Numerologia" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Structured Data for Rich Results */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Jé Fêrraz Numerologia",
          "description": description,
          "url": url,
          "author": {
            "@type": "Person",
            "name": "Jé Fêrraz"
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${url}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          },
          "offers": {
            "@type": "Offer",
            "description": "Serviços de Numerologia Cabalística",
            "category": "Spiritual Services"
          }
        })}
      </script>
    </Helmet>
  );
};