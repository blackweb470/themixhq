import { Search, Mail, Menu, X } from 'lucide-react';
import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { IconBrandInstagram, IconBrandX, IconBrandYoutube, IconBrandTiktok } from '@tabler/icons-react';

export const Logo = () => (
  <div className="flex items-center justify-center w-40 md:w-60 lg:w-72 h-14 md:h-16 lg:h-20 relative">
    <img src="/logo.png" alt="THE MIX HQ" className="absolute scale-[1.8] object-contain pointer-events-none" />
  </div>
);

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="border-b-4 border-black bg-white sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-4 max-w-7xl mx-auto relative">
          <div className="flex items-center lg:space-x-6 w-full lg:w-auto justify-center lg:justify-start">
            <button 
              className="lg:hidden absolute left-4 p-1 hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-7 h-7 stroke-[2]" />
            </button>
            <Link to="/">
              <Logo />
            </Link>
            <nav className="hidden lg:flex space-x-6 ml-4 text-[13px] font-bold uppercase tracking-wider text-gray-800">
              <Link to="/category/afrobeats" className="hover:text-red-600 transition-colors">Afrobeats</Link>
              <Link to="/category/nollywood" className="hover:text-red-600 transition-colors">Nollywood</Link>
              <Link to="/category/music" className="hover:text-red-600 transition-colors">Music</Link>
              <Link to="/category/lifestyle" className="hover:text-red-600 transition-colors">Lifestyle</Link>
              <Link to="/category/culture" className="hover:text-red-600 transition-colors">Culture</Link>
              <Link to="/category/gossip" className="hover:text-red-600 transition-colors">Gossip</Link>
            </nav>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-[13px] font-bold uppercase tracking-wider text-gray-800">
            <div className="flex items-center space-x-4 mr-2 border-r border-gray-200 pr-6">
              <a href="https://www.instagram.com/themixhq" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors" title="Instagram">
                <IconBrandInstagram size={20} stroke={2} />
              </a>
              <a href="https://x.com/themixhq" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors" title="X (Twitter)">
                <IconBrandX size={20} stroke={2} />
              </a>
              <a href="https://www.youtube.com/channel/UClg_zZDhtHTOchV2ovjl7VA" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors" title="YouTube">
                <IconBrandYoutube size={20} stroke={2} />
              </a>
              <a href="https://www.tiktok.com/@themixhq?_t=8fNoAJVElB0&_r=1" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors" title="TikTok">
                <IconBrandTiktok size={20} stroke={2} />
              </a>
            </div>
            <button className="flex items-center space-x-2 hover:text-red-600 transition-colors"><Search className="w-4 h-4 stroke-[2.5]"/> <span className="hidden xl:inline">Search</span></button>
            <button className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"><Mail className="w-4 h-4 stroke-[2.5]"/> <span className="hidden xl:inline">Newsletter</span></button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-50 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed top-0 left-0 h-full w-[85%] max-w-[400px] bg-white z-50 lg:hidden flex flex-col transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b-2 border-black/10">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
            <Logo />
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6 text-gray-800" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-6">
          <nav className="flex flex-col space-y-6 text-lg font-bold uppercase tracking-wider text-gray-800">
            <Link to="/category/afrobeats" className="hover:text-red-600 transition-colors flex items-center justify-between" onClick={() => setIsMobileMenuOpen(false)}>
              <span>Afrobeats</span>
            </Link>
            <Link to="/category/nollywood" className="hover:text-red-600 transition-colors flex items-center justify-between" onClick={() => setIsMobileMenuOpen(false)}>
              <span>Nollywood</span>
            </Link>
            <Link to="/category/music" className="hover:text-red-600 transition-colors flex items-center justify-between" onClick={() => setIsMobileMenuOpen(false)}>
              <span>Music</span>
            </Link>
            <Link to="/category/lifestyle" className="hover:text-red-600 transition-colors flex items-center justify-between" onClick={() => setIsMobileMenuOpen(false)}>
              <span>Lifestyle</span>
            </Link>
            <Link to="/category/culture" className="hover:text-red-600 transition-colors flex items-center justify-between" onClick={() => setIsMobileMenuOpen(false)}>
              <span>Culture</span>
            </Link>
            <Link to="/category/gossip" className="hover:text-red-600 transition-colors flex items-center justify-between" onClick={() => setIsMobileMenuOpen(false)}>
              <span>Gossip</span>
            </Link>
          </nav>
        </div>

        <div className="p-6 bg-gray-50 border-t-2 border-black/10">
          <div className="flex justify-between items-center mb-6 px-2">
            <a href="https://www.instagram.com/themixhq" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-red-600 transition-colors">
              <IconBrandInstagram size={26} stroke={2} />
            </a>
            <a href="https://x.com/themixhq" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-red-600 transition-colors">
              <IconBrandX size={26} stroke={2} />
            </a>
            <a href="https://www.youtube.com/channel/UClg_zZDhtHTOchV2ovjl7VA" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-red-600 transition-colors">
              <IconBrandYoutube size={26} stroke={2} />
            </a>
            <a href="https://www.tiktok.com/@themixhq?_t=8fNoAJVElB0&_r=1" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-red-600 transition-colors">
              <IconBrandTiktok size={26} stroke={2} />
            </a>
          </div>
          <div className="flex flex-col space-y-3">
            <button className="flex items-center justify-center space-x-2 py-3 border-2 border-black font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all text-sm">
              <Search className="w-4 h-4 stroke-[2.5]" />
              <span>Search</span>
            </button>
            <button className="flex items-center justify-center space-x-2 py-3 bg-red-600 text-white font-bold uppercase tracking-widest hover:bg-red-700 transition-all text-sm">
              <Mail className="w-4 h-4 stroke-[2.5]" />
              <span>Newsletter</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
