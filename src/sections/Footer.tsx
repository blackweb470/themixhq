import { Instagram, Twitter, Youtube, Music } from 'lucide-react';

const footerLinks = {
  music: [
    'New Releases',
    'Album Reviews',
    'Chart Updates',
    'Music Videos',
    'Artist Interviews',
  ],
  celebrity: [
    'Latest Gossip',
    'Relationship News',
    'Red Carpet',
    'Social Media Drama',
    'Exclusive Scoops',
  ],
  lifestyle: [
    'Fashion Trends',
    'Street Style',
    'Nightlife Guide',
    'Food & Culture',
    'Travel',
  ],
  company: [
    'About Us',
    'Careers',
    'Advertise',
    'Contact',
    'Privacy Policy',
  ],
};

export default function Footer() {
  return (
    <footer className="relative w-full bg-black border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="font-display text-2xl font-bold tracking-tight text-white">
              THE<span className="text-[#bc13fe]">MIX</span>HQ
            </a>
            <p className="mt-4 text-sm text-white/40 leading-relaxed">
              Your premier destination for Afrobeats, celebrity news, fashion, and everything shaping Nigerian pop culture.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-white/30 hover:text-[#bc13fe] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/30 hover:text-[#1DA1F2] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/30 hover:text-red-500 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/30 hover:text-[#bc13fe] transition-colors">
                <Music className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Music Links */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-white/60 mb-4">
              Music
            </h4>
            <ul className="space-y-3">
              {footerLinks.music.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-white/30 hover:text-[#bc13fe] transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Celebrity Links */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-white/60 mb-4">
              Celebrity
            </h4>
            <ul className="space-y-3">
              {footerLinks.celebrity.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-white/30 hover:text-[#bc13fe] transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Lifestyle Links */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-white/60 mb-4">
              Lifestyle
            </h4>
            <ul className="space-y-3">
              {footerLinks.lifestyle.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-white/30 hover:text-[#bc13fe] transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-white/60 mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-white/30 hover:text-[#bc13fe] transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/20">
            &copy; 2026 Themixhq. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-white/20 hover:text-white/40 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-xs text-white/20 hover:text-white/40 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-white/20 hover:text-white/40 transition-colors">
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
