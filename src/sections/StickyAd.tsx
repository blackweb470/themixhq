import { useState } from 'react';
import { X } from 'lucide-react';

export default function StickyAd() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 md:hidden">
      <div className="flex items-center justify-between px-4 py-2">
        <span className="text-[10px] text-white/30 uppercase tracking-wider">Ad</span>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 text-white/30 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="h-[50px] ad-banner mx-4 mb-2 rounded">
        <span>Sticky Footer Ad — 320x50 Mobile</span>
      </div>
    </div>
  );
}
