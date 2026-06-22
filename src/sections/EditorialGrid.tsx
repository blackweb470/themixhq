import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useArticles } from '@/hooks/useData';
import { ArticleCardSkeleton } from '@/components/Skeleton';
import { Clock, Share2, MessageCircle } from 'lucide-react';
import ArticleModal from './ArticleModal';

gsap.registerPlugin(ScrollTrigger);

const categoryColors: Record<string, string> = {
  music: '#bc13fe',
  celebrity: '#ff006e',
  lifestyle: '#0066cc',
  videos: '#8338ec',
};

export default function EditorialGrid() {
  const { articles, isLoading } = useArticles();
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredArticles = activeFilter === 'all'
    ? articles
    : articles.filter(a => a.category === activeFilter);

  const filters = [
    { key: 'all', label: 'ALL' },
    { key: 'music', label: 'MUSIC' },
    { key: 'celebrity', label: 'CELEBRITY' },
    { key: 'lifestyle', label: 'LIFESTYLE' },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        grid.children,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [activeFilter]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 md:py-40 bg-black"
      id="music"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-medium tracking-[0.3em] text-[#bc13fe] uppercase">
              Latest Stories
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tight mt-2">
              EDITORIAL
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 text-xs font-medium tracking-wider transition-all duration-200 ${
                  activeFilter === filter.key
                    ? 'bg-[#bc13fe] text-white'
                    : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Inline Ad */}
        <div className="w-full h-[250px] ad-banner mb-12 rounded-lg">
          <span>In-Article Ad Placement — Responsive</span>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading || !articles.length ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className={idx === 0 ? 'md:col-span-2 lg:col-span-2' : ''}>
                <ArticleCardSkeleton />
              </div>
            ))
          ) : (
            filteredArticles.map((article, index) => (
            <article
              key={article.id}
              className={`group bg-[#111111] rounded-lg overflow-hidden hover-lift cursor-pointer ${
                index === 0 ? 'md:col-span-2 lg:col-span-2' : ''
              }`}
              onClick={() => setSelectedArticle(article.id)}
            >
              {/* Image */}
              <div
                className={`relative overflow-hidden ${
                  index === 0 ? 'aspect-[16/9]' : 'aspect-[4/3]'
                }`}
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />

                {/* Category Badge */}
                <div
                  className="absolute top-4 left-4 px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-white"
                  style={{ backgroundColor: categoryColors[article.category] }}
                >
                  {article.categoryLabel}
                </div>

                {/* Trending/Breaking badges */}
                {article.trending && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white text-black text-[10px] font-bold tracking-wider uppercase">
                    TRENDING
                  </div>
                )}
                {article.breaking && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-red-600 text-white text-[10px] font-bold tracking-wider uppercase animate-pulse">
                    BREAKING
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg md:text-xl font-semibold text-white leading-tight group-hover:text-[#bc13fe] transition-colors duration-200 line-clamp-2">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm text-white/50 line-clamp-2">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-3 text-xs text-white/40">
                    <span>{article.author}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="text-white/30 hover:text-[#bc13fe] transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="text-white/30 hover:text-[#bc13fe] transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
            ))
          )}
        </div>

        {/* Second Inline Ad */}
        <div className="w-full h-[250px] ad-banner mt-12 rounded-lg">
          <span>In-Article Ad Placement — Mid Content</span>
        </div>
      </div>

      {/* Article Modal */}
      <ArticleModal
        articleId={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </section>
  );
}
