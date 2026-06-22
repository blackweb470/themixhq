import React from 'react';
import { Search, Mail, Menu } from 'lucide-react';
import { Link } from 'react-router';

export const Logo = () => (
  <img src="/logo.png" alt="THE MIX HQ" className="h-10 md:h-12 object-contain" />
);

export const Navbar = () => (
  <header className="border-b-4 border-black bg-white sticky top-0 z-50">
    <div className="flex items-center justify-between px-4 py-4 max-w-7xl mx-auto">
      <div className="flex items-center space-x-6">
        <Menu className="w-6 h-6 lg:hidden cursor-pointer" />
        <Link to="/">
          <Logo />
        </Link>
        <nav className="hidden lg:flex space-x-6 ml-4 text-[13px] font-bold uppercase tracking-wider text-gray-800">
          <Link to="/category/afrobeats" className="hover:text-red-600">Afrobeats</Link>
          <Link to="/category/nollywood" className="hover:text-red-600">Nollywood</Link>
          <Link to="/category/music" className="hover:text-red-600">Music</Link>
          <Link to="/category/lifestyle" className="hover:text-red-600">Lifestyle</Link>
          <Link to="/category/culture" className="hover:text-red-600">Culture</Link>
          <Link to="/category/gossip" className="hover:text-red-600">Gossip</Link>
        </nav>
      </div>
      <div className="hidden md:flex items-center space-x-6 text-[13px] font-bold uppercase tracking-wider text-gray-800">
        <button className="flex items-center space-x-2 hover:text-red-600"><Search className="w-4 h-4 stroke-[2.5]"/> <span className="hidden xl:inline">Search</span></button>
        <button className="flex items-center space-x-2 text-red-600 hover:text-red-700"><Mail className="w-4 h-4 stroke-[2.5]"/> <span className="hidden xl:inline">Newsletter</span></button>
      </div>
    </div>
  </header>
);
