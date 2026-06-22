import { IconBrandInstagram, IconBrandX, IconBrandYoutube, IconBrandTiktok, IconBrandThreads, IconMail } from '@tabler/icons-react';
import { Logo } from './Navbar';
import { Link } from 'react-router';

export const Footer = () => (
  <footer className="bg-gray-100 py-12 border-t border-gray-200 mt-12">
    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-start">
      <div className="mb-8 md:mb-0">
        <Logo />
        <div className="flex flex-wrap gap-3 mt-6">
          <a href="https://www.instagram.com/themixhq" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-red-600 transition-colors" title="Instagram">
            <IconBrandInstagram size={18} />
          </a>
          <a href="https://x.com/themixhq" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-red-600 transition-colors" title="X (Twitter)">
            <IconBrandX size={18} />
          </a>
          <a href="https://www.youtube.com/channel/UClg_zZDhtHTOchV2ovjl7VA" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-red-600 transition-colors" title="YouTube">
            <IconBrandYoutube size={18} />
          </a>
          <a href="https://www.tiktok.com/@themixhq?_t=8fNoAJVElB0&_r=1" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-red-600 transition-colors" title="TikTok">
            <IconBrandTiktok size={18} />
          </a>
          <a href="https://www.threads.com/@themixhq?igshid=NTc4MTIwNjQ2YQ%3D%3D" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-red-600 transition-colors" title="Threads">
            <IconBrandThreads size={18} />
          </a>
          <a href="mailto:Themixnaija@gmail.com" className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-red-600 transition-colors" title="Email">
            <IconMail size={18} />
          </a>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm text-gray-600 font-semibold">
        <div className="flex flex-col space-y-3">
          <Link to="/about" className="hover:text-black">About Us</Link>
          <a href="#" className="hover:text-black">Careers</a>
          <a href="#" className="hover:text-black">Newsletters</a>
        </div>
        <div className="flex flex-col space-y-3">
          <a href="#" className="hover:text-black">Privacy Policy</a>
          <a href="#" className="hover:text-black">Terms of Service</a>
          <a href="#" className="hover:text-black">Cookie Settings</a>
        </div>
        <div className="flex flex-col space-y-3">
          <a href="#" className="hover:text-black">Contact</a>
          <a href="#" className="hover:text-black">Advertise</a>
          <a href="#" className="hover:text-black">Sitemap</a>
        </div>
        <div className="flex flex-col space-y-3">
          <a href="#" className="hover:text-black">EU Privacy</a>
          <a href="#" className="hover:text-black">California Notice</a>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 mt-12 text-xs text-gray-500 font-semibold">
      &copy; 2020 theMixhq. All rights reserved. theMixhq is a registered trademark of theMixhq.
    </div>
  </footer>
);
