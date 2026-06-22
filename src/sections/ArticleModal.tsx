import { useEffect, useRef } from 'react';
import { useArticles } from '@/hooks/useData';
import { X, Share2, MessageCircle, Clock, Heart, Bookmark, Phone, Twitter, Send, Link2 } from 'lucide-react';
import gsap from 'gsap';

interface ArticleModalProps {
  articleId: string | null;
  onClose: () => void;
}

export default function ArticleModal({ articleId, onClose }: ArticleModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { articles } = useArticles();

  const article = articles.find(a => a.id === articleId);

  useEffect(() => {
    if (!articleId || !overlayRef.current || !contentRef.current) return;

    document.body.style.overflow = 'hidden';

    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 }
    );
    gsap.fromTo(
      contentRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.1 }
    );

    return () => {
      document.body.style.overflow = '';
    };
  }, [articleId]);

  const handleClose = () => {
    if (!overlayRef.current || !contentRef.current) {
      onClose();
      return;
    }

    gsap.to(contentRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.3,
      ease: 'power3.in',
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      delay: 0.1,
      onComplete: onClose,
    });
  };

  if (!article) return null;

  const categoryColors: Record<string, string> = {
    music: '#bc13fe',
    celebrity: '#ff006e',
    lifestyle: '#0066cc',
    videos: '#8338ec',
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl overflow-y-auto"
      onClick={handleClose}
    >
      <div className="min-h-screen flex items-start justify-center py-8 px-4">
        <div
          ref={contentRef}
          className="relative w-full max-w-3xl bg-[#111111] rounded-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hero Image */}
          <div className="relative aspect-video">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
            <div
              className="absolute top-4 left-4 px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-white"
              style={{ backgroundColor: categoryColors[article.category] }}
            >
              {article.categoryLabel}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              {article.title}
            </h1>
            {article.subheading && (
              <h2 className="text-lg md:text-xl text-white/80 font-medium leading-tight mt-3">
                {article.subheading}
              </h2>
            )}

            <div className="flex items-center gap-4 mt-4 text-sm text-white/40">
              <span className="font-medium text-white/60">{article.author}</span>
              <span>{article.date}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {article.readTime}
              </span>
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-3 mt-6">
              <span className="text-xs text-white/40 uppercase tracking-wider">Share:</span>
              <button className="p-2.5 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors">
                <Phone className="w-4 h-4" />
              </button>
              <button className="p-2.5 rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 transition-colors">
                <Twitter className="w-4 h-4" />
              </button>
              <button className="p-2.5 rounded-full bg-[#0088CC]/10 text-[#0088CC] hover:bg-[#0088CC]/20 transition-colors">
                <Send className="w-4 h-4" />
              </button>
              <button className="p-2.5 rounded-full bg-white/5 text-white/50 hover:bg-white/10 transition-colors">
                <Link2 className="w-4 h-4" />
              </button>
            </div>

            <div 
              className="mt-6 text-white/70 leading-relaxed space-y-6
                       [&>p]:mb-6 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-white [&>h2]:mt-10 [&>h2]:mb-4
                       [&>blockquote]:border-l-4 [&>blockquote]:border-[#bc13fe] [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:text-white/90 [&>blockquote]:my-8 [&>blockquote]:text-xl
                       [&>p>a]:text-[#bc13fe] hover:[&>p>a]:underline
                       [&>img]:w-full [&>img]:h-auto [&>img]:rounded-xl [&>img]:my-8
                       [&>video]:w-full [&>video]:h-auto [&>video]:rounded-xl [&>video]:my-8 [&>video]:bg-black
                       [&>iframe]:w-full [&>iframe]:aspect-video [&>iframe]:rounded-xl [&>iframe]:my-8"
              dangerouslySetInnerHTML={{ __html: article.content || `<p>${article.excerpt}</p>` }}
            />

            {/* Actions */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-sm text-white/40 hover:text-[#bc13fe] transition-colors">
                  <Heart className="w-4 h-4" />
                  <span>Like</span>
                </button>
                <button className="flex items-center gap-2 text-sm text-white/40 hover:text-[#bc13fe] transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span>Comment</span>
                </button>
                <button className="flex items-center gap-2 text-sm text-white/40 hover:text-[#bc13fe] transition-colors">
                  <Bookmark className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
              <button className="flex items-center gap-2 text-sm text-white/40 hover:text-[#bc13fe] transition-colors">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
