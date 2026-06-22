import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  articleData?: {
    publishedTime: string;
    modifiedTime?: string;
    author: string;
    tags?: string[];
  };
}

export function SEO({
  title = 'Themixhq | Entertainment News & Afrobeats',
  description = 'Your #1 source for the latest entertainment news, afrobeats updates, gossip, and culture from Themixhq.',
  image = 'https://themixhq.com/logo.png', // Fallback to logo or a default OG image
  url = 'https://themixhq.com',
  type = 'website',
  articleData,
}: SEOProps) {
  // Ensure the title always has branding unless it's perfectly crafted
  const formattedTitle = title.includes('Themixhq') ? title : `${title} | Themixhq`;

  // Structured Data (JSON-LD)
  const structuredData = type === 'article' && articleData ? {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": title,
    "image": [image],
    "datePublished": articleData.publishedTime,
    "dateModified": articleData.modifiedTime || articleData.publishedTime,
    "author": [{
      "@type": "Person",
      "name": articleData.author,
    }],
    "publisher": {
      "@type": "Organization",
      "name": "Themixhq",
      "logo": {
        "@type": "ImageObject",
        "url": "https://themixhq.com/logo.png"
      }
    }
  } : {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Themixhq",
    "url": "https://themixhq.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://themixhq.com/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{formattedTitle}</title>
      <meta name="description" content={description} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Themixhq" />

      {/* Article Specific Open Graph */}
      {type === 'article' && articleData && (
        <>
          <meta property="article:published_time" content={articleData.publishedTime} />
          {articleData.modifiedTime && <meta property="article:modified_time" content={articleData.modifiedTime} />}
          <meta property="article:author" content={articleData.author} />
          {articleData.tags?.map((tag) => (
            <meta property="article:tag" content={tag} key={tag} />
          ))}
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@themixhq" />
      <meta name="twitter:creator" content="@themixhq" />

      {/* Structured Data JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}
