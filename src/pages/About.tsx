import React, { useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { Music, Zap, Globe, Sparkles, TrendingUp, Users } from 'lucide-react';

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-red-600 selection:text-white">
      <SEO 
        title="About theMixhq | Nigerian Entertainment & Pop Culture"
        description="theMixhq is a fast-paced, meme-heavy Nigerian entertainment and pop culture Instagram blog covering viral videos, trending Naija gist, and Afrobeats news."
      />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-16 lg:py-24">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full font-bold text-sm uppercase tracking-wider mb-6">
            <Sparkles size={16} /> THEMIXHQ BLOG
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-8">
            The Heartbeat of <span className="text-red-600">Naija Pop Culture</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-serif leading-relaxed">
            @themixhq is a premier Nigerian entertainment and pop culture Instagram blog. 
            We deliver the fastest, most relatable lifestyle content and Afrobeats news to millions of fans globally.
          </p>
        </section>

        {/* Vibe Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24 bg-gray-50 rounded-3xl p-8 lg:p-16 border border-gray-100">
          <div>
            <h2 className="text-3xl md:text-4xl font-black mb-6 flex items-center gap-3">
              <Zap className="text-red-600" size={32} /> Our Vibe
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed font-serif mb-6">
              Think fast-paced, meme-heavy, street-to-celebrity coverage. We break relatable lifestyle content + Afrobeats news, and our exclusive posts regularly get picked up by major Nigerian media sites like Legit.ng.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed font-serif">
              Whether it's the latest Davido moments, Wizkid throwback stories, or concert reactions, our active community keeps the conversation going. We are proudly active in the Davido fanbase too!
            </p>
          </div>
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
            <img src="/images/music-culture.jpg" alt="theMixhq Vibe" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <p className="text-white font-black text-2xl">Fast-paced. Meme-heavy. Relatable.</p>
            </div>
          </div>
        </section>

        {/* What We Post */}
        <section className="mb-24">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-16">What We Post</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-red-600 transition-colors group">
              <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp size={28} />
              </div>
              <h3 className="text-xl font-black mb-4">Viral Videos & Naija Gist</h3>
              <p className="text-gray-600 font-serif leading-relaxed">
                From rent wahala in Asaba to concert reactions, we bring you the most talked-about trending stories and Davido moments as they happen.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-red-600 transition-colors group">
              <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Music size={28} />
              </div>
              <h3 className="text-xl font-black mb-4">Music Drops & Reactions</h3>
              <p className="text-gray-600 font-serif leading-relaxed">
                We are the frontline for Afrobeats. Covering massive music drops and fan reactions, like Kizz Daniel's hit 'Twe Twe' release.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-red-600 transition-colors group">
              <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe size={28} />
              </div>
              <h3 className="text-xl font-black mb-4">Pop Culture Commentary</h3>
              <p className="text-gray-600 font-serif leading-relaxed">
                Our sharp commentary and takes are heavily referenced and often reposted by leading news outlets with credit to @themixhq.
              </p>
            </div>
          </div>
        </section>

        {/* Followed By Section */}
        <section className="bg-black text-white rounded-3xl p-8 lg:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600"></div>
          <Users size={48} className="mx-auto mb-8 text-red-600" />
          <h2 className="text-3xl md:text-5xl font-black mb-6">Followed by the Biggest Names</h2>
          <p className="text-lg md:text-xl text-gray-300 font-serif max-w-3xl mx-auto mb-12">
            theMixhq is heavily recognized and followed by top industry heavyweights globally. Our audience includes:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-3 text-red-500">Top Nigerian Celebrities</h3>
              <p className="text-gray-400 font-serif">The biggest Afrobeats superstars, Nollywood actors, and influencers who shape the Naija culture daily.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-3 text-red-500">American Rappers</h3>
              <p className="text-gray-400 font-serif">Global hip-hop icons and US industry executives keeping a close eye on the exploding Afrobeats movement.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-3 text-red-500">UK Celebrities</h3>
              <p className="text-gray-400 font-serif">Leading British musicians, Grime artists, and pop culture figures connected to the global African diaspora.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
