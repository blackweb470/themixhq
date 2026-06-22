import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { Facebook, Twitter, Link as LinkIcon, ThumbsUp, ThumbsDown, PlayCircle } from 'lucide-react';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Newsletter } from '@/components/Newsletter';
import { useArticles, useComments } from '@/hooks/useData';
import { Skeleton } from '@/components/Skeleton';
import { supabase } from '@/lib/supabase';
import { AdSlot } from '@/components/AdSlot';
import { SEO } from '@/components/SEO';


export default function Article() {
  const { id } = useParams();
  const { articles, isLoading } = useArticles();
  
  const article = articles.find(a => a.id === id);

  const { comments, isLoading: isCommentsLoading, mutate } = useComments(article?.id);
  const [authorName, setAuthorName] = React.useState('');
  const [commentContent, setCommentContent] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [localLikes, setLocalLikes] = React.useState(0);
  const [localDislikes, setLocalDislikes] = React.useState(0);
  const [hasVoted, setHasVoted] = React.useState<string | null>(null);

  useEffect(() => {
    if (article) {
      setLocalLikes(article.likes || 0);
      setLocalDislikes(article.dislikes || 0);
      
      const votedState = localStorage.getItem(`voted_${article.id}`);
      setHasVoted(votedState);
    }
  }, [article?.id]);

  const handleVote = async (type: 'up' | 'down') => {
    if (hasVoted || !article) return;
    
    setHasVoted(type);
    localStorage.setItem(`voted_${article.id}`, type);

    if (type === 'up') {
      setLocalLikes(prev => prev + 1);
      await supabase.from('articles').update({ likes: (article.likes || 0) + 1 }).eq('id', article.id);
    } else {
      setLocalDislikes(prev => prev + 1);
      await supabase.from('articles').update({ dislikes: (article.dislikes || 0) + 1 }).eq('id', article.id);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !commentContent.trim() || !article) return;
    
    setIsSubmitting(true);
    const { error } = await supabase.from('comments').insert({
      article_id: article.id,
      author_name: authorName,
      content: commentContent
    });
    
    if (!error) {
      setAuthorName('');
      setCommentContent('');
      mutate();
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading || !articles.length) {
    return (
      <div className="min-h-screen bg-white text-black font-sans">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-8 space-y-6">
              <Skeleton className="w-24 h-4 rounded-full" />
              <Skeleton className="w-full h-16" />
              <Skeleton className="w-full h-8" />
              <Skeleton className="w-full h-[400px] mt-6" />
            </div>
            {/* Sidebar Column */}
            <div className="lg:col-span-4 space-y-8">
              <div className="sticky top-20 space-y-8">
                <AdSlot zone="Sidebar Widget" slotIndex={0} />
                <AdSlot zone="Sidebar Widget" slotIndex={1} />
                <Newsletter />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black font-sans">
        <h1 className="text-2xl font-bold">Article not found</h1>
        <Link to="/" className="ml-4 text-red-600 hover:underline">Go back home</Link>
      </div>
    );
  }

  // Generate some dummy content
  const dummyContent = `
    <p>The highly anticipated event sent shockwaves through the entertainment industry this week, confirming rumors that have been swirling for months. Fans and critics alike are already calling it a defining moment of the decade.</p>
    
    <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 30px 0; font-family: sans-serif; font-size: 14px; font-weight: bold; border: 1px solid #e5e7eb;">
      [ Embedded Social Media Post Placeholder ]
    </div>

    <p>During the exclusive reveal, the atmosphere was nothing short of electric. The fusion of traditional elements with cutting-edge production created an experience that resonated deeply with the audience. "We wanted to push the boundaries of what is possible," the team stated in a brief press release prior to the showcase.</p>
    
    <h2>A New Era Begins</h2>
    
    <p>Industry insiders point out that this is more than just a single event; it's a statement of intent. The landscape of African entertainment is rapidly evolving, and this latest development proves that the creative scene is not just keeping up with global trends—it's setting them.</p>
    
    <blockquote>"It's about telling our own stories in the most unapologetic way possible. We are here, and our voices are louder than ever."</blockquote>
    
    <p>With international eyes increasingly focused on the continent's cultural output, the pressure to deliver has never been higher. Yet, rather than buckling under the weight of expectations, the creators have used it as fuel.</p>
    
    <p>As the dust settles, one thing is abundantly clear: the standard has been raised. The coming months will likely see a wave of inspired projects aiming to capture a fraction of this magic. For now, however, everyone is simply enjoying the moment.</p>
  `;

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-red-600 selection:text-white">
      <SEO 
        title={article.seo_title || article.title}
        description={article.seo_description || article.excerpt}
        image={article.image}
        url={`https://themixhq.com/article/${article.id}`}
        type="article"
        keywords={`${article.categoryLabel}, entertainment, afrobeats, ${article.title.split(' ').filter(w => w.length > 3).slice(0, 5).join(', ')}`}
        articleData={{
          publishedTime: article.date,
          author: article.author,
          section: article.categoryLabel,
          tags: [article.categoryLabel, 'Themixhq']
        }}
      />
      <Navbar />

      <AdSlot zone="Header Banner" />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8">
            <p className="text-[11px] font-bold uppercase text-red-600 tracking-wider mb-3">{article.categoryLabel}</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6">
              {article.title}
            </h1>
            {article.subheading && (
              <h2 className="text-2xl md:text-3xl text-gray-800 font-bold leading-tight mb-6">
                {article.subheading}
              </h2>
            )}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 font-serif leading-relaxed">
              {article.excerpt}
            </p>
            
            {/* Byline */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-b border-gray-200 py-4 mb-8 space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 flex items-center justify-center">
                  <img src="/logo.png" alt="theMixhq" className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 uppercase tracking-wide">By <span className="text-red-600">{article.author}</span></p>
                  <p className="text-xs text-gray-500 font-semibold mt-1">Published on {new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-red-600 hover:border-red-600 transition-colors"><Facebook className="w-4 h-4" /></button>
                <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-red-600 hover:border-red-600 transition-colors"><Twitter className="w-4 h-4" /></button>
                <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-red-600 hover:border-red-600 transition-colors"><LinkIcon className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Hero Image */}
            <figure className="mb-10">
              <img src={article.image} alt={article.title} className="w-full h-auto max-h-[600px] object-cover bg-gray-200" />
              <figcaption className="text-xs text-gray-500 mt-2 text-right font-semibold">Image: {article.author} / theMixhq</figcaption>
            </figure>

            {/* Article Body */}
            <div className="text-lg md:text-xl text-gray-900 font-serif leading-relaxed space-y-6
                       [&>p]:mb-6 
                       [&>h1]:text-3xl [&>h1]:md:text-4xl [&>h1]:font-sans [&>h1]:font-black [&>h1]:mt-12 [&>h1]:mb-6
                       [&>h2]:text-2xl [&>h2]:md:text-3xl [&>h2]:font-sans [&>h2]:font-black [&>h2]:mt-12 [&>h2]:mb-4
                       [&>h3]:text-xl [&>h3]:md:text-2xl [&>h3]:font-sans [&>h3]:font-bold [&>h3]:mt-10 [&>h3]:mb-4
                       [&>ul]:list-disc [&>ul]:pl-8 [&>ul]:mb-6 [&>ul>li]:mb-2 [&>ul>li]:pl-2
                       [&>ol]:list-decimal [&>ol]:pl-8 [&>ol]:mb-6 [&>ol>li]:mb-2 [&>ol>li]:pl-2
                       [&>blockquote]:border-l-4 [&>blockquote]:border-red-600 [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:text-gray-700 [&>blockquote]:my-8 [&>blockquote]:text-2xl
                       [&>p>a]:text-red-600 hover:[&>p>a]:underline
                       [&>img]:w-full [&>img]:h-auto [&>img]:rounded-xl [&>img]:my-8 [&>img]:shadow-md
                       [&>video]:w-full [&>video]:h-auto [&>video]:rounded-xl [&>video]:my-8 [&>video]:shadow-md
                       [&>iframe]:w-full [&>iframe]:aspect-video [&>iframe]:rounded-xl [&>iframe]:my-8 [&>iframe]:shadow-md"
                 dangerouslySetInnerHTML={{ __html: article.content || dummyContent }}
            />

            {/* Interaction Footer & Comments */}
            <div className="mt-12 border-t border-gray-200 pt-10 flex items-center gap-4">
              <button 
                onClick={() => handleVote('up')}
                disabled={!!hasVoted}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-[13px] uppercase tracking-wider transition-colors border ${hasVoted === 'up' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300 hover:border-green-600 hover:text-green-600'} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ThumbsUp size={16} /> {localLikes}
              </button>
              <button 
                onClick={() => handleVote('down')}
                disabled={!!hasVoted}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-[13px] uppercase tracking-wider transition-colors border ${hasVoted === 'down' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-700 border-gray-300 hover:border-red-600 hover:text-red-600'} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ThumbsDown size={16} /> {localDislikes}
              </button>
            </div>

            <div className="mt-10 border-t border-gray-200 pt-12">
              <h3 className="text-2xl font-black mb-6 tracking-tight">Discussion ({comments.length})</h3>
              
              <form onSubmit={handleCommentSubmit} className="mb-10 bg-gray-50 p-6 border border-gray-200">
                <div className="mb-4">
                  <input 
                    type="text" 
                    required 
                    placeholder="Your Name" 
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full max-w-sm px-4 py-3 border border-gray-300 font-sans text-sm focus:border-red-600 focus:ring-0 outline-none transition-colors"
                  />
                </div>
                <div className="mb-4">
                  <textarea 
                    required 
                    rows={4} 
                    placeholder="Join the conversation..." 
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 font-sans text-sm focus:border-red-600 focus:ring-0 outline-none transition-colors resize-y"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-black text-white px-8 py-3 font-bold uppercase tracking-widest text-xs hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </button>
              </form>
              
              <div className="my-8">
                <AdSlot zone="In-Article Feed" />
              </div>

              <div className="space-y-6">
                {isCommentsLoading ? (
                  <div className="text-gray-500 font-bold uppercase text-xs">Loading comments...</div>
                ) : comments.length === 0 ? (
                  <div className="text-gray-500 font-serif italic text-lg py-4">No comments yet. Be the first to share your thoughts!</div>
                ) : (
                  comments.map((comment: any) => (
                    <div key={comment.id} className="pb-6 border-b border-gray-100 last:border-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 text-xs uppercase">
                          {comment.author_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm tracking-tight">{comment.author_name}</p>
                          <p className="text-xs text-gray-500 font-semibold">{new Date(comment.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                      <p className="text-gray-800 font-serif leading-relaxed text-[15px]">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 hidden lg:block space-y-8">
            <div className="sticky top-20 space-y-8">
              <AdSlot zone="Sidebar Widget" slotIndex={0} />
              <div className="w-[300px] h-[250px] bg-black text-white mx-auto flex items-center justify-center text-4xl font-black italic border-b-4 border-red-600">
                theMixhq
              </div>
              <AdSlot zone="Sidebar Widget" slotIndex={1} />
            </div>
          </div>
        </div>

        {/* Newsletter Banner */}
        <Newsletter />

        {/* Trending / Related */}
        <div className="mt-12 border-t-4 border-black pt-8">
          <h2 className="text-2xl md:text-3xl font-black mb-8 flex items-center">
            <span className="w-3 h-3 rounded-full bg-red-600 mr-3"></span>
            Trending News
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.slice(0, 4).map((a, idx) => (
              <Link to={`/article/${a.id}`} key={idx} className="group cursor-pointer block relative">
                <img src={a.image} className="w-full h-[250px] object-cover mb-4 bg-gray-200" />
                <div className="absolute top-3 left-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md">
                  <PlayCircle className="w-5 h-5 text-black" />
                </div>
                <p className="text-[11px] font-bold uppercase text-red-600 tracking-wider mb-2">Must Read</p>
                <h4 className="text-base md:text-lg font-bold leading-tight group-hover:text-gray-600 transition-colors">{a.title}</h4>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-16 border-t-2 border-gray-200 pt-8 mb-12">
          <h2 className="text-lg font-bold mb-8 text-gray-500 uppercase tracking-widest">Related Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.slice(4, 8).map((a, idx) => (
              <Link to={`/article/${a.id}`} key={idx} className="group cursor-pointer block">
                <img src={a.image} className="w-full h-[150px] object-cover mb-3 bg-gray-200" />
                <p className="text-[10px] font-bold uppercase text-red-600 tracking-wider mb-1">{a.categoryLabel}</p>
                <h4 className="text-sm font-bold leading-tight group-hover:text-gray-600 transition-colors">{a.title}</h4>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
