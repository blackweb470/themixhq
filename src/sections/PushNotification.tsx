import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';

export default function PushNotification() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible || isSubscribed) return null;

  return (
    <div className="fixed bottom-24 right-4 md:right-8 z-50 max-w-sm glass-card rounded-xl p-5 animate-in slide-in-from-bottom-4 duration-500">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-3 right-3 p-1 text-white/30 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-4">
        <div className="p-3 rounded-full bg-[#bc13fe]/10 text-[#bc13fe] shrink-0">
          <Bell className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">
            Stay in the loop
          </h4>
          <p className="text-xs text-white/50 mt-1 leading-relaxed">
            Get instant breaking news alerts delivered to your browser. Never miss a story.
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setIsSubscribed(true)}
              className="px-4 py-2 bg-[#bc13fe] text-white text-xs font-medium rounded hover:bg-[#9d00ff] transition-colors"
            >
              Enable
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="px-4 py-2 text-white/40 text-xs font-medium hover:text-white transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
