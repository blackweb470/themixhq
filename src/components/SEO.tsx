import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  keywords?: string;
  articleData?: {
    publishedTime: string;
    modifiedTime?: string;
    author: string;
    section?: string;
    tags?: string[];
  };
}

export function SEO({
  title = 'Themixhq | Entertainment News & Afrobeats',
  description = 'Your #1 source for the latest entertainment news, afrobeats updates, gossip, and culture from Themixhq.',
  image = 'https://themixhq.com/logo.png', // Fallback to logo or a default OG image
  url = 'https://themixhq.com',
  type = 'website',
  keywords = 'entertainment, afrobeats, news, gossip, culture, nollywood, music, africa, celebrities',
  articleData,
}: SEOProps) {
  // Ensure the title always has branding unless it's perfectly crafted
  const formattedTitle = title.includes('Themixhq') ? title : `${title} | Themixhq`;

  // Structured Data (JSON-LD)
  const structuredData = type === 'article' && articleData ? {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "headline": title,
    "image": [image],
    "datePublished": articleData.publishedTime,
    "dateModified": articleData.modifiedTime || articleData.publishedTime,
    "author": [{
      "@type": "Person",
      "name": articleData.author,
      "url": "https://themixhq.com"
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
    "description": description,
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
      <meta name="keywords" content={keywords} />
      <meta name="author" content={articleData?.author || "Themixhq"} />
      <meta name="publisher" content="Themixhq" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Themixhq" />
      <meta property="og:locale" content="en_US" />

      {/* Article Specific Open Graph */}
      {type === 'article' && articleData && (
        <>
          <meta property="article:published_time" content={articleData.publishedTime} />
          {articleData.modifiedTime && <meta property="article:modified_time" content={articleData.modifiedTime} />}
          <meta property="article:author" content={articleData.author} />
          {articleData.section && <meta property="article:section" content={articleData.section} />}
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
