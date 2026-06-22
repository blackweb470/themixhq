import { useEffect, useRef } from 'react';
import { TrendingUp } from 'lucide-react';
import { useArticles } from '@/hooks/useData';

export default function TrendingBar() {
  const { articles, isLoading } = useArticles();
  const trendingArticles = articles.filter(a => a.trending || a.breaking).slice(0, 5);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationId: number;
    let scrollPos = 0;

    const animate = () => {
      scrollPos += 0.5;
      if (scrollPos >= el.scrollWidth / 2) {
        scrollPos = 0;
      }
      el.scrollLeft = scrollPos;
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="w-full bg-[#0a0a0a] border-b border-white/5 py-3 overflow-hidden">
      <div className="flex items-center gap-4 px-4 md:px-8">
        <div className="flex items-center gap-2 shrink-0">
          <TrendingUp className="w-4 h-4 text-[#bc13fe]" />
          <span className="text-xs font-semibold tracking-wider uppercase text-[#bc13fe]">
            Trending
          </span>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-8 overflow-hidden whitespace-nowrap"
          style={{ scrollbarWidth: 'none' }}
        >
          {[...trendingArticles, ...trendingArticles].map((article, i) => (
            <a
              key={`${article.id}-${i}`}
              href="#"
              className="text-xs text-white/50 hover:text-white transition-colors inline-flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#bc13fe] shrink-0" />
              {article.title}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
