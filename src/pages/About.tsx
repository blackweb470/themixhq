import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';

export default function About() {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-red-600 selection:text-white">
      <SEO 
        title="About TheMixHQ | Nigerian Entertainment & Pop Culture"
        description="TheMixHQ is a leading Nigerian digital entertainment platform and blog dedicated to delivering the latest updates in Afrobeats, celebrity news, viral moments, music, lifestyle, and pop culture."
      />
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <Navbar />
      </div>

      <main className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        <article className="prose prose-lg prose-red mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-12 text-center">About TheMixHQ</h1>
          
          <div className="space-y-8 text-gray-800 text-lg md:text-xl leading-relaxed">
            <p>
              TheMixHQ is a leading Nigerian digital entertainment platform and blog dedicated to delivering the latest updates in Afrobeats, celebrity news, viral moments, music, lifestyle, and pop culture. Renowned for its fast, engaging, and reliable coverage, TheMixHQ has become a go-to destination for millions of entertainment lovers seeking real-time stories from Nigeria and across the globe.
            </p>
            
            <p>
              With a strong presence across social media platforms, TheMixHQ provides daily coverage of trending topics, exclusive celebrity reactions, music releases, industry developments, and unforgettable moments shaping the entertainment landscape. The platform’s commitment to timely and engaging content has helped it build a loyal and rapidly growing audience.
            </p>

            <p>
              Widely recognized online by its popular handle <strong>@TheMixNaija</strong>, the platform has established itself as the premier hub for the latest updates on Afrobeats heavyweights like Davido, Wizkid, and Burna Boy. From exclusive coverage of Big Brother Naija (BBNaija) stars and viral celebrity interviews to trending social commentary, TheMixHQ ensures its audience never misses a beat in the fast-paced world of Nigerian entertainment.
            </p>

            <div className="my-12 w-full h-[400px] md:h-[500px] bg-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <img src="/images/music-culture.jpg" alt="TheMixHQ Culture" className="w-full h-full object-cover" />
            </div>
            
            <p>
              Over the years, TheMixHQ has gained recognition from some of the biggest names in entertainment, sports, and popular culture. Its content has been viewed, shared, reposted, and acknowledged by top celebrities, musicians, influencers, and public figures from Nigeria and beyond, further solidifying its position as one of Africa’s emerging entertainment media brands.
            </p>
            
            <p>
              Driven by a passion for storytelling and digital innovation, TheMixHQ continues to connect audiences with the stories that matter most, serving as a trusted source for entertainment news, celebrity updates, and viral culture worldwide.
            </p>
          </div>

          <section className="mt-20 pt-16 border-t border-gray-100 text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-6">Contact Us</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto">
              Want to partner with us, send a tip, or request a feature? We are always open to hearing from our community and brands.
            </p>
            <div className="inline-block bg-gray-50 p-8 rounded-2xl border border-gray-200 min-w-[300px] hover:shadow-md transition-shadow">
              <p className="text-lg text-gray-900 font-bold mb-3">General Inquiries</p>
              <a href="mailto:Themixnaija@gmail.com" className="text-red-600 hover:text-red-700 font-bold text-xl md:text-2xl transition-colors">
                Themixnaija@gmail.com
              </a>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
