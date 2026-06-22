import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CultureStatement() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    if (!section || !left || !right) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        left.children,
        { x: -80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        right.children,
        { x: 80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
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

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 md:py-40 bg-[#0a0a0a]"
      id="trends"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
          {/* Left - Typography Poster */}
          <div ref={leftRef} className="space-y-2">
            <span className="block font-display text-[14vw] md:text-[8vw] font-black leading-[0.85] tracking-tight uppercase text-white">
              MORE
            </span>
            <span className="block font-display text-[14vw] md:text-[8vw] font-black leading-[0.85] tracking-tight uppercase text-white">
              THAN
            </span>
            <span className="block font-display text-[14vw] md:text-[8vw] font-black leading-[0.85] tracking-tight uppercase text-white">
              A
            </span>
            <span className="block font-display text-[14vw] md:text-[8vw] font-black leading-[0.85] tracking-tight uppercase text-[#bc13fe]">
              MOMENT
            </span>
          </div>

          {/* Right - Copy + Image */}
          <div ref={rightRef} className="space-y-8">
            <p className="text-lg md:text-xl text-white/60 leading-relaxed">
              Themixhq is where culture lives and breathes. We don&apos;t just
              report on trends — we anticipate them. From the underground
              soundscapes of Lagos to the global stages of Afrobeats, we
              document the movements that define a generation.
            </p>
            <p className="text-base text-white/40 leading-relaxed">
              Our mission is simple: amplify the voices, styles, and sounds
              shaping Nigerian and African pop culture. Whether it&apos;s a
              groundbreaking album drop, a viral fashion moment, or the next
              big celebrity story — if it matters, you&apos;ll find it here
              first.
            </p>
            <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
              <img
                src="/images/editorial-fashion.jpg"
                alt="Street fashion editorial"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
