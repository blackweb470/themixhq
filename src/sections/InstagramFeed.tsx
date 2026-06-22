import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useInstagram } from '@/hooks/useData';
import { InstagramSkeleton } from '@/components/Skeleton';
import { Heart, Instagram } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function InstagramFeed() {
  const { posts, isLoading } = useInstagram();
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        grid.children,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 md:py-32 bg-[#0a0a0a]"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-medium tracking-[0.3em] text-[#bc13fe] uppercase">
              @themixhq
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight mt-2">
              FOLLOW THE WAVE
            </h2>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-white/50 hover:text-[#bc13fe] transition-colors"
          >
            <Instagram className="w-5 h-5" />
            <span className="tracking-wider">Follow on Instagram</span>
          </a>
        </div>

        {/* Instagram Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
        >
          {isLoading || !posts.length ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <InstagramSkeleton key={idx} />
            ))
          ) : (
            posts.map((post) => (
              <a
                key={post.id}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-lg overflow-hidden bg-[#111111]"
              >
                <img
                  src={post.image}
                  alt={post.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1 text-white">
                    <Heart className="w-5 h-5" fill="white" />
                    <span className="text-sm font-semibold">
                      {(post.likes / 1000).toFixed(1)}k
                    </span>
                  </div>
                  <span className="text-xs text-white/60 mt-2">{post.caption}</span>
                </div>
              </a>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
