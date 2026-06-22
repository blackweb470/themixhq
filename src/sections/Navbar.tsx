import { useState, useEffect } from 'react';
import { Menu, X, Search, Bell } from 'lucide-react';

const navLinks = [
  { label: 'TRENDS', href: '#trends' },
  { label: 'MUSIC', href: '#music' },
  { label: 'STYLE', href: '#style' },
  { label: 'TECH', href: '#tech' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-black/90 backdrop-blur-xl border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        {/* Top ad banner */}
        <div className="w-full h-[50px] md:h-[90px] ad-banner hidden md:flex">
          <span>Advertisement - 728x90</span>
        </div>
        <div className="w-full h-[50px] ad-banner flex md:hidden">
          <span>Ad - 320x50</span>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a
              href="#"
              className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white"
            >
              THE<span className="text-[#bc13fe]">MIX</span>HQ
            </a>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-xs font-medium tracking-widest text-white/70 hover:text-[#bc13fe] transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-white/70 hover:text-[#bc13fe] transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 text-white/70 hover:text-[#bc13fe] transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#bc13fe] rounded-full" />
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-white/70 hover:text-[#bc13fe] transition-colors"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>

              <button className="hidden md:block text-xs font-medium tracking-widest text-black bg-white px-5 py-2 hover:bg-[#bc13fe] hover:text-white transition-all duration-200">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-xl transition-all duration-500 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-display text-4xl font-bold text-white hover:text-[#bc13fe] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <button className="mt-8 text-sm font-medium tracking-widest text-black bg-white px-8 py-3 hover:bg-[#bc13fe] hover:text-white transition-all duration-200">
            SUBSCRIBE
          </button>
        </div>
      </div>

      {/* Search Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/90 backdrop-blur-xl transition-all duration-300 ${
          isSearchOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full px-4">
          <button
            onClick={() => setIsSearchOpen(false)}
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white"
          >
            <X className="w-8 h-8" />
          </button>
          <input
            type="text"
            placeholder="Search articles, artists, trends..."
            className="w-full max-w-2xl bg-transparent border-b-2 border-white/20 focus:border-[#bc13fe] text-3xl md:text-5xl font-display text-white text-center outline-none pb-4 placeholder:text-white/20"
            autoFocus={isSearchOpen}
          />
          <p className="mt-6 text-sm text-white/40">
            Press ESC to close
          </p>
        </div>
      </div>

      {/* Notification Dropdown */}
      <div
        className={`fixed top-20 right-4 md:right-8 z-50 w-80 glass-card rounded-lg overflow-hidden transition-all duration-300 ${
          isNotifOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="p-4 border-b border-white/5">
          <h3 className="text-sm font-semibold tracking-wider">BREAKING NEWS</h3>
        </div>
        <div className="divide-y divide-white/5">
          {[
            'Wizkid drops surprise single at midnight',
            'Davido announces charity concert in Lagos',
            'New Afrobeats documentary coming to Netflix',
          ].map((news, i) => (
            <button key={i} className="w-full text-left p-4 hover:bg-white/5 transition-colors">
              <p className="text-sm text-white/80">{news}</p>
              <span className="text-xs text-white/40 mt-1 block">{i + 1}h ago</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
