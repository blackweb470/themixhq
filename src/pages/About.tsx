import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';

export default function About() {
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleScroll = () => {
      const sections = ['about', 'our-vibe', 'what-we-post', 'audience', 'editorial', 'contact'];
      let currentSection = sections[0];
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            currentSection = section;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    { id: 'about', label: 'About The Mix HQ' },
    { id: 'our-vibe', label: 'Our Vibe' },
    { id: 'what-we-post', label: 'What We Post' },
    { id: 'audience', label: 'Our Audience' },
    { id: 'editorial', label: 'Editorial Guidelines' },
    { id: 'contact', label: 'Contact Us' }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-red-600 selection:text-white">
      <SEO 
        title="About theMixhq | Nigerian Entertainment & Pop Culture"
        description="theMixhq is a fast-paced, meme-heavy Nigerian entertainment and pop culture Instagram blog covering viral videos, trending Naija gist, and Afrobeats news."
      />
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <Navbar />
      </div>

      <main className="max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row gap-12 lg:gap-24 relative">
        
        {/* Left Sidebar - Table of Contents */}
        <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
          <div className="sticky top-32 bg-gray-50/80 p-6 lg:p-8 rounded-lg border border-gray-100">
            <h3 className="font-bold text-[17px] mb-5 text-black">In This Article</h3>
            <ul className="space-y-4 border-l-2 border-gray-200">
              {sections.map((section) => (
                <li key={section.id} className="relative">
                  <button 
                    onClick={() => scrollToSection(section.id)}
                    className={`block w-full text-left pl-4 text-[15px] transition-colors ${
                      activeSection === section.id 
                        ? 'text-red-600 font-bold before:absolute before:left-[-2px] before:top-0 before:bottom-0 before:w-[2px] before:bg-red-600' 
                        : 'text-gray-600 hover:text-black font-medium'
                    }`}
                  >
                    {section.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Right Content - Main Articles */}
        <article className="flex-1 max-w-3xl prose prose-lg prose-red">
          
          <section id="about" className="mb-16 pt-4 scroll-mt-32">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6">About The Mix HQ</h1>
            <p className="text-xl text-gray-700 leading-relaxed mb-6 font-serif">
              As one of our readers once wrote: For years, <em>The Mix HQ</em> has run the pop culture alphabet from Afrobeats to Zendaya.
            </p>
            <p className="text-xl text-gray-700 leading-relaxed font-serif">
              Heck, in the summer of 2023, the streets even called us the "pop-culture bible" — a validation of our commitment to being smart, funny, and first to bring you the latest Nigerian entertainment news.
            </p>
            <div className="mt-10 w-full h-[400px] bg-gray-100 rounded-xl overflow-hidden">
              <img src="/images/music-culture.jpg" alt="The Mix HQ Culture" className="w-full h-full object-cover" />
            </div>
          </section>

          <section id="our-vibe" className="mb-16 scroll-mt-32">
            <h2 className="text-3xl font-black mb-6">Our Vibe</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Think fast-paced, meme-heavy, street-to-celebrity coverage. We break relatable lifestyle content and Afrobeats news, and our exclusive posts regularly get picked up by major Nigerian media sites like Legit.ng.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Whether it's the latest Davido moments, Wizkid throwback stories, or concert reactions, our active community keeps the conversation going. We set the timeline on fire.
            </p>
          </section>

          <section id="what-we-post" className="mb-16 scroll-mt-32">
            <h2 className="text-3xl font-black mb-8">What We Post</h2>
            <div className="space-y-8">
              <div className="border-l-4 border-red-600 pl-4">
                <h3 className="text-xl font-bold mb-2">Viral Videos & Gist</h3>
                <p className="text-gray-700">From rent wahala in Asaba to concert reactions, we bring you the most talked-about trending stories and celebrity moments as they happen.</p>
              </div>
              <div className="border-l-4 border-red-600 pl-4">
                <h3 className="text-xl font-bold mb-2">Music Drops</h3>
                <p className="text-gray-700">We are the frontline for Afrobeats. Covering massive music drops and fan reactions instantly.</p>
              </div>
              <div className="border-l-4 border-red-600 pl-4">
                <h3 className="text-xl font-bold mb-2">Pop Culture Commentary</h3>
                <p className="text-gray-700">Our sharp commentary and takes are heavily referenced and often reposted by leading news outlets globally.</p>
              </div>
            </div>
          </section>

          <section id="audience" className="mb-16 scroll-mt-32">
            <h2 className="text-3xl font-black mb-6">Our Audience</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              The Mix HQ is heavily recognized and followed by top industry heavyweights globally. Our core audience includes:
            </p>
            <ul className="list-disc pl-6 space-y-4 text-gray-700 text-lg">
              <li><strong>Top Nigerian Celebs:</strong> The biggest Afrobeats superstars, Nollywood actors, and influencers who shape the Naija culture daily.</li>
              <li><strong>American Rappers:</strong> Global hip-hop icons and US industry executives keeping a close eye on the exploding Afrobeats movement.</li>
              <li><strong>UK Celebrities:</strong> Leading British musicians, Grime artists, and pop culture figures connected to the global African diaspora.</li>
            </ul>
          </section>

          <section id="editorial" className="mb-16 scroll-mt-32">
            <h2 className="text-3xl font-black mb-6">Editorial Guidelines</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Accuracy, fairness, and speed are at the core of what we do. We verify our sources before publishing exclusive gist. While we lean heavily into entertainment, memes, and humor, we maintain a strict policy against fake news and malicious defamation.
            </p>
          </section>

          <section id="contact" className="mb-16 scroll-mt-32">
            <h2 className="text-3xl font-black mb-6">Contact Us</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Want to partner with us, send a tip, or request a feature? We are always open to hearing from our community and brands.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="text-lg text-gray-900 font-bold mb-2">General Inquiries</p>
              <a href="mailto:info@themixhq.com" className="text-red-600 hover:text-red-700 font-medium">info@themixhq.com</a>
            </div>
          </section>

        </article>
      </main>

      <Footer />
    </div>
  );
}
