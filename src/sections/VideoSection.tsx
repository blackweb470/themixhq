import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, Volume2, VolumeX } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function VideoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelector('.video-container'),
        { scale: 0.85, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 md:py-32 bg-black"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-medium tracking-[0.3em] text-[#bc13fe] uppercase">
              Featured
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase tracking-tight mt-2">
              WATCH THE LATEST MIX
            </h2>
          </div>
          <button className="hidden md:block text-xs font-medium tracking-widest text-white/50 hover:text-[#bc13fe] transition-colors uppercase">
            View All Videos
          </button>
        </div>

        <div className="video-container relative aspect-video rounded-lg overflow-hidden bg-[#0a0a0a] group cursor-pointer"
          onClick={togglePlay}
        >
          <video
            ref={videoRef}
            src="/videos/tropical-sunset-drive.mp4"
            loop
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

          {/* Play button overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Play className="w-8 h-8 text-white ml-1" fill="white" />
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
              className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-white/70 hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          {/* Caption */}
          <div className="absolute bottom-4 left-4 pointer-events-none">
            <p className="text-sm text-white/70 font-medium">
              Themixhq Reels — Tropical Sunset Drive
            </p>
            <p className="text-xs text-white/40 mt-1">
              Experience the vibe
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
