import { useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Newsletter } from '@/components/Newsletter';
import { usePublishedArticlesInfinite } from '@/hooks/useData';
import { ArticleCardSkeleton } from '@/components/Skeleton';
import { SEO } from '@/components/SEO';

import NotFound from './NotFound';

const VALID_CATEGORIES = ['afrobeats', 'nollywood', 'music', 'lifestyle', 'culture', 'gossip'];

export default function Category() {
  const { slug } = useParams();
  const { articles, isLoading, size, setSize, isReachingEnd } = usePublishedArticlesInfinite(slug);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (slug && !VALID_CATEGORIES.includes(slug.toLowerCase())) {
    return <NotFound />;
  }

  // Slug comes from the Navbar links e.g. /category/music
  const categoryTitle = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'Category';
  const categoryDescription = `Read the latest news, updates, and trending stories in ${categoryTitle} from Themixhq.`;

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <SEO 
        title={`${categoryTitle} News & Updates`} 
        description={categoryDescription}
        url={`https://themixhq.com/category/${slug}`}
      />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-10 border-b-4 border-black pb-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">{categoryTitle}</h1>
          <p className="text-gray-500 mt-2 font-semibold">Latest news and updates in {categoryTitle}.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ArticleCardSkeleton />
            <ArticleCardSkeleton />
            <ArticleCardSkeleton />
          </div>
        ) : articles.length === 0 ? (
          <div className="py-20 text-center">
            <h2 className="text-2xl font-bold text-gray-400">No articles found in this category yet.</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, idx) => (
              <Link to={`/article/${article.id}`} key={idx} className="group cursor-pointer block">
                <img src={article.image} alt={article.title} className="w-full h-[250px] object-cover mb-4 bg-gray-200" />
                <p className="text-[11px] font-bold uppercase text-red-600 tracking-wider mb-2">{article.categoryLabel}</p>
                <h3 className="text-2xl font-bold leading-tight group-hover:text-gray-600 transition-colors mb-2">{article.title}</h3>
                <p className="text-gray-600 font-serif line-clamp-3">{article.excerpt}</p>
                <div className="mt-4 flex items-center space-x-2 text-xs text-gray-500 font-semibold">
                  <span>By {article.author}</span>
                  <span>•</span>
                  <span>{new Date(article.date).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!isReachingEnd && !isLoading && articles.length > 0 && (
          <div className="mt-12 text-center">
            <button 
              onClick={() => setSize(size + 1)}
              className="bg-black text-white px-8 py-3 font-bold uppercase tracking-widest text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              Load More
            </button>
          </div>
        )}
      </main>

      <Newsletter />
      
      <Footer />
    </div>
  );
}
