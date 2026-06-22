import React from 'react';
import { ChevronRight, PlayCircle } from 'lucide-react';
import { Link } from 'react-router';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Newsletter } from '@/components/Newsletter';
import { usePublishedArticlesInfinite } from '@/hooks/useData';
import { ArticleCardSkeleton } from '@/components/Skeleton';
import { AdSlot } from '@/components/AdSlot';
import { SEO } from '@/components/SEO';

const SectionHeader = ({ title, icon }: { title: string, icon?: React.ReactNode }) => (
  <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-4">
    <div className="flex items-center space-x-2">
      {icon && <span className="text-red-600">{icon}</span>}
      <h2 className="text-2xl font-black tracking-tight">{title}</h2>
    </div>
    <a href="#" className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-black flex items-center">
      More <ChevronRight className="w-4 h-4 ml-1" />
    </a>
  </div>
);

const ArticleListMini = ({ title, data }: { title: string, data: any[] }) => (
  <div>
    <div className="bg-red-600 text-white font-bold uppercase tracking-widest text-sm py-1 px-3 mb-4 inline-block">
      {title}
    </div>
    <div className="flex flex-col space-y-6">
      {data.map((article, idx) => (
        <Link to={`/article/${article.id}`} key={idx} className="flex space-x-4 group cursor-pointer">
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase text-red-600 tracking-wider mb-1">{article.categoryLabel}</p>
            <h3 className="text-sm font-bold leading-tight group-hover:text-gray-600 transition-colors">{article.title}</h3>
            <p className="text-xs text-gray-500 mt-2">By {article.author}</p>
          </div>
          <img src={article.image} alt={article.title} className="w-20 h-20 object-cover bg-gray-200" />
        </Link>
      ))}
    </div>
  </div>
);

export default function Home() {
  const { articles, isLoading } = usePublishedArticlesInfinite();

  if (isLoading || !articles.length) {
    return (
      <div className="min-h-screen bg-white text-black font-sans">
        <SEO />
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            <div className="lg:col-span-3 space-y-6">
              <ArticleCardSkeleton />
              <ArticleCardSkeleton />
            </div>
            <div className="lg:col-span-6">
              <ArticleCardSkeleton />
            </div>
            <div className="lg:col-span-3 space-y-6">
              <ArticleCardSkeleton />
              <ArticleCardSkeleton />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const latestNews = articles.slice(0, 5);
  const heroArticle = articles[5] || articles[0];
  const mustReads = articles.slice(6, 11);
  const tvNews = articles.slice(2, 6);
  const movieNews = articles.slice(7, 10);
  const musicNews = articles.slice(1, 5);

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <SEO />
      <Navbar />

      <AdSlot zone="Header Banner" />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Latest News Left Column */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-black mb-4 flex items-center">
              <span className="w-3 h-3 rounded-full bg-red-600 mr-2"></span>
              Latest News
            </h2>
            <div className="flex flex-col space-y-6 divide-y divide-gray-100">
              {latestNews.map((article, idx) => (
                <Link to={`/article/${article.id}`} key={idx} className={`flex space-x-3 group cursor-pointer ${idx !== 0 ? 'pt-6' : ''}`}>
                  <img src={article.image} alt={article.title} className="w-24 h-24 object-cover bg-gray-200" />
                  <div>
                    <p className="text-[10px] font-bold uppercase text-red-600 tracking-wider mb-1">{article.categoryLabel}</p>
                    <h3 className="text-[13px] font-bold leading-tight group-hover:text-gray-600 transition-colors">{article.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Hero Article Center Column */}
          <Link to={`/article/${heroArticle.id}`} className="lg:col-span-6 group cursor-pointer block">
            <div className="relative mb-4">
              <img src={heroArticle.image} alt={heroArticle.title} className="w-full h-[400px] object-cover bg-gray-200" />
            </div>
            <p className="text-[12px] font-bold uppercase text-red-600 tracking-wider mb-2">{heroArticle.categoryLabel}</p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1] mb-3 group-hover:text-gray-600 transition-colors">
              {heroArticle.title}
            </h1>
            <p className="text-lg text-gray-700 mb-4 font-serif">
              {heroArticle.excerpt}
            </p>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              By {heroArticle.author}
            </p>
          </Link>

          <div className="lg:col-span-3 space-y-8">
            <ArticleListMini title="Trending Afrobeats" data={mustReads} />
            <div className="sticky top-20 space-y-8">
              <AdSlot zone="Sidebar Widget" slotIndex={0} />
              <AdSlot zone="Sidebar Widget" slotIndex={1} />
            </div>
          </div>
        </div>

        {/* Afrobeats & Celebs Section */}
        <div className="mb-12">
          <SectionHeader title="Afrobeats & Celebs" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link to={`/article/${articles[0].id}`} className="group cursor-pointer block">
              <img src={articles[0].image} className="w-full h-[300px] object-cover mb-4 bg-gray-200" />
              <p className="text-[11px] font-bold uppercase text-red-600 tracking-wider mb-1">Exclusive</p>
              <h3 className="text-2xl font-bold leading-tight group-hover:text-gray-600 transition-colors">{articles[0].title}</h3>
            </Link>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {musicNews.map((article, idx) => (
                <Link to={`/article/${article.id}`} key={idx} className="group cursor-pointer flex flex-col">
                  <img src={article.image} className="w-full h-[120px] object-cover mb-2 bg-gray-200" />
                  <h4 className="text-sm font-bold leading-tight group-hover:text-gray-600 transition-colors">{article.title}</h4>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Nollywood & TV Section */}
        <div className="mb-12">
          <SectionHeader title="Nollywood & TV" icon={<PlayCircle className="w-6 h-6" />} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Link to={`/article/${tvNews[0].id}`} className="lg:col-span-2 group cursor-pointer relative block">
              <img src={tvNews[0].image} className="w-full h-[400px] object-cover bg-gray-200" />
              <div className="mt-4">
                 <p className="text-[11px] font-bold uppercase text-red-600 tracking-wider mb-1">Recaps</p>
                 <h3 className="text-3xl font-black leading-tight group-hover:text-gray-600 transition-colors">{tvNews[0].title}</h3>
              </div>
            </Link>
            <div className="flex flex-col space-y-6">
              {tvNews.slice(1).map((article, idx) => (
                <Link to={`/article/${article.id}`} key={idx} className="group cursor-pointer block">
                  <img src={article.image} className="w-full h-[180px] object-cover mb-2 bg-gray-200" />
                  <p className="text-[11px] font-bold uppercase text-red-600 tracking-wider mb-1">Nollywood Review</p>
                  <h4 className="text-lg font-bold leading-tight group-hover:text-gray-600 transition-colors">{article.title}</h4>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* African Cinema Section */}
        <div className="mb-12 border-t-4 border-black pt-8">
          <SectionHeader title="African Cinema" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <Link to={`/article/${movieNews[0].id}`} className="lg:col-span-8 group cursor-pointer block">
              <img src={movieNews[0].image} className="w-full h-[400px] object-cover mb-4 bg-gray-200" />
              <p className="text-[11px] font-bold uppercase text-red-600 tracking-wider mb-1">Box Office Africa</p>
              <h3 className="text-4xl font-black leading-tight group-hover:text-gray-600 transition-colors mb-2">{movieNews[0].title}</h3>
              <p className="text-gray-700">{movieNews[0].excerpt}</p>
            </Link>
            <div className="lg:col-span-4 flex flex-col space-y-6 divide-y divide-gray-200">
              {movieNews.slice(1).map((article, idx) => (
                <Link to={`/article/${article.id}`} key={idx} className={`group cursor-pointer flex space-x-4 ${idx !== 0 ? 'pt-6' : ''}`}>
                  <img src={article.image} className="w-24 h-24 object-cover bg-gray-200" />
                  <div>
                    <p className="text-[11px] font-bold uppercase text-red-600 tracking-wider mb-1">Cinema News</p>
                    <h4 className="text-[15px] font-bold leading-tight group-hover:text-gray-600 transition-colors">{article.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Culture Spotlight / Multi-grid */}
        <div className="mb-12">
          <SectionHeader title="Culture Spotlight" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {articles.slice(8, 11).map((article, idx) => (
              <Link to={`/article/${article.id}`} key={idx} className="group cursor-pointer block">
                <img src={article.image} className="w-full h-[350px] object-cover mb-4 bg-gray-200 grayscale contrast-125" />
                <p className="text-[11px] font-bold uppercase text-red-600 tracking-wider mb-1">Digital Cover</p>
                <h4 className="text-xl font-bold leading-tight group-hover:text-gray-600 transition-colors">{article.title}</h4>
              </Link>
            ))}
          </div>
        </div>

      </main>

      <Newsletter />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
