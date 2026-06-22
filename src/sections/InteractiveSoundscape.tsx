import { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Heart } from 'lucide-react';

const PALETTE = ['#bc13fe', '#9d00ff', '#7b2cbf', '#3c096c', '#ff006e', '#8338ec', '#0066cc'];

class Point {
  pos: { x: number; y: number };
  oldPos: { x: number; y: number };
  target: { x: number; y: number };
  velocity: { x: number; y: number };
  anchor: { x: number; y: number };
  friction: number;
  springFactor: number;
  gravity: number;

  constructor(x: number, y: number, friction: number, springFactor: number, gravity: number) {
    this.pos = { x, y };
    this.oldPos = { x, y };
    this.target = { x, y };
    this.velocity = { x: 0, y: 0 };
    this.anchor = { x, y };
    this.friction = friction;
    this.springFactor = springFactor;
    this.gravity = gravity;
  }

  update(mouseX: number | null, mouseY: number | null) {
    let targetX = this.target.x;
    let targetY = this.target.y;

    if (mouseX !== null && mouseY !== null) {
      const dx = this.pos.x - mouseX;
      const dy = this.pos.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 200;
      if (dist < maxDist) {
        targetX = this.pos.x - (dx / dist) * 100;
        targetY = this.pos.y - (dy / dist) * 100;
      }
    }

    const ax = (targetX - this.pos.x) * this.springFactor;
    const ay = (targetY - this.pos.y) * this.springFactor + this.gravity;

    this.velocity.x += ax;
    this.velocity.y += ay;
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;
    this.oldPos = { ...this.pos };
    this.pos.x += this.velocity.x;
    this.pos.y += this.velocity.y;
  }
}

class SpringLine {
  points: Point[];
  n: number;
  color: string;
  width: number;

  constructor(color: string) {
    this.points = [];
    this.n = 30;
    this.color = color;
    this.width = Math.random() * 2 + 1;
    for (let i = 0; i < this.n; i++) {
      const p = new Point(0, i * 15, 0.93, 0.05, 0.1);
      this.points.push(p);
    }
  }

  update(mouseX: number | null, mouseY: number | null, time: number) {
    let x = 0;
    for (let j = 0; j < this.points.length; j++) {
      const p = this.points[j];
      p.pos.x = x + Math.sin(j * 0.2 + time) * 50;
      p.update(mouseX, mouseY);
      x += 0.5;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.points.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(this.points[0].pos.x, this.points[0].pos.y);

    for (let j = 1; j < this.points.length; j++) {
      const p = this.points[j];
      const prev = this.points[j - 1];
      ctx.quadraticCurveTo(
        prev.pos.x,
        prev.pos.y,
        (prev.pos.x + p.pos.x) / 2,
        (prev.pos.y + p.pos.y) / 2
      );
    }

    const last = this.points[this.points.length - 1];
    ctx.lineTo(last.pos.x, last.pos.y);

    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Endpoint dots
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.arc(this.points[0].pos.x, this.points[0].pos.y, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(last.pos.x, last.pos.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function InteractiveSoundscape() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = section.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();

    const lines: SpringLine[] = [];
    for (let i = 0; i < 40; i++) {
      const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      const line = new SpringLine(color);
      // Spread lines across canvas
      const startX = Math.random() * canvas.width;
      const startY = Math.random() * canvas.height * 0.5;
      for (let j = 0; j < line.points.length; j++) {
        line.points[j].pos.x = startX;
        line.points[j].pos.y = startY + j * 15;
        line.points[j].target.x = startX;
        line.points[j].target.y = startY + j * 15;
      }
      lines.push(line);
    }

    let animationId: number;
    let time = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      time += 0.02;

      // Trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const line of lines) {
        line.update(mouseRef.current.x, mouseRef.current.y, time);
        line.draw(ctx);
      }
    };
    animate();

    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-32 md:py-48 overflow-hidden"
      style={{ background: '#000000' }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'auto',
        }}
      />

      {/* Background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[2]">
        <h2 className="font-display text-[15vw] md:text-[10vw] font-black uppercase tracking-tight text-white/[0.03]">
          FEEL THE VIBE
        </h2>
      </div>

      {/* Glassmorphism Player Card */}
      <div className="relative z-10 flex items-center justify-center px-4">
        <div className="glass-card rounded-2xl p-6 md:p-8 w-full max-w-md">
          {/* Track Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#bc13fe] to-[#0066cc] flex items-center justify-center">
              <span className="text-2xl">🎵</span>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Afrobeats Mix 2026</h3>
              <p className="text-white/50 text-sm">Themixhq curated playlist</p>
            </div>
            <button className="ml-auto text-white/30 hover:text-[#bc13fe] transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>

          {/* Visualizer Bars */}
          <div className="flex items-end justify-center gap-1 h-16 mb-6">
            {Array.from({ length: 32 }).map((_, i) => (
              <div
                key={i}
                className="w-1.5 rounded-full transition-all duration-150"
                style={{
                  height: isPlaying
                    ? `${Math.random() * 100}%`
                    : `${20 + Math.sin(i * 0.5) * 15}%`,
                  background: i % 3 === 0 ? '#bc13fe' : i % 3 === 1 ? '#0066cc' : '#7b2cbf',
                  opacity: 0.7,
                  animation: isPlaying
                    ? `pulse ${0.3 + Math.random() * 0.5}s ease-in-out infinite alternate`
                    : 'none',
                }}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6">
            <button className="text-white/50 hover:text-white transition-colors">
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-14 h-14 rounded-full bg-[#bc13fe] flex items-center justify-center hover:bg-[#9d00ff] transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-1" />
              )}
            </button>
            <button className="text-white/50 hover:text-white transition-colors">
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#bc13fe] to-[#0066cc] rounded-full transition-all duration-1000"
                style={{ width: isPlaying ? '65%' : '0%' }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-white/30">
              <span>2:14</span>
              <span>3:42</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
