import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

const neonVertexShader = `
varying vec2 v_uv;
void main() {
  v_uv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const neonFragmentShader = `
precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_tilt;
uniform float u_neonGlow;
uniform float u_blobCount;
uniform float u_throb;
varying vec2 v_uv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float hash1(float n) {
  return fract(sin(n) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float noiseTilt(vec2 p, float t) {
  float t2 = t * 0.3;
  float t3 = t * 0.7;
  vec2 offset = vec2(sin(t2 + p.y * 0.1) * t3, cos(t * 0.5 + p.x * 0.2) * t2);
  return noise(p + offset);
}

vec3 background(vec2 uv, float t) {
  float tiltAmount = u_tilt;
  float n = noiseTilt(uv * 3.0, tiltAmount);
  float n2 = noiseTilt(uv * 6.0 + vec2(n, n), tiltAmount * 1.5);
  float pattern = n * 0.5 + n2 * 0.5;
  float wobble = noiseTilt(uv * 2.0, t * 0.5) * 0.15;
  vec3 col = mix(vec3(0.0), vec3(0.0, 0.1, 0.1), pattern + wobble);
  col += vec3(0.05, 0.0, 0.1) * n2;
  float scratchNoise = noiseTilt(vec2(uv.x * 50.0, uv.y * 3.0), t * 2.0);
  col += vec3(0.3, 0.3, 0.35) * scratchNoise * 0.1;
  col += vec3(0.5, 0.5, 0.6) * smoothstep(0.6, 1.0, scratchNoise) * 0.05;
  return col;
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / u_resolution.y;
  uv.x *= aspect;
  float t = u_time;
  vec2 blobUV = v_uv * 2.0 - 1.0;
  blobUV.x *= aspect;
  float numBlobs = floor(u_blobCount + 0.5);
  vec3 col = background(uv, t);
  float distort = 0.0;

  for (int i = 0; i < 6; i++) {
    if (float(i) >= numBlobs) break;
    float seed = float(i) * 47.3;
    float angle = hash1(seed) * 6.2831853 + t * (0.2 + hash1(seed + 1.0) * 0.3);
    float radius = 0.15 + hash1(seed + 2.0) * 0.25;
    vec2 center = vec2(cos(angle) * radius * aspect, sin(angle * (0.7 + hash1(seed + 3.0) * 0.6)) * radius * 0.6);
    float blobDist = length(blobUV - center);
    float size = 0.05 + hash1(seed + 4.0) * 0.08;
    float throb = 1.0 + sin(t * (1.5 + hash1(seed + 5.0)) + float(i) * 2.0) * 0.15 * u_throb;
    size *= throb;
    float blob = smoothstep(size, size * 0.3, blobDist);
    float outerGlow = smoothstep(size * 4.0, size, blobDist) * 0.4 * u_neonGlow;
    distort += blob * 0.1;

    float colorIndex = mod(float(i), 3.0);
    vec3 blobColor;
    if (colorIndex < 1.0) {
      blobColor = vec3(0.74, 0.07, 0.99);
    } else if (colorIndex < 2.0) {
      blobColor = vec3(0.0, 0.4, 0.8);
    } else {
      blobColor = vec3(0.8, 0.0, 0.6);
    }

    col += blobColor * blob * 0.8;
    col += blobColor * outerGlow;

    if (i > 0) {
      float prevSeed = float(i - 1) * 47.3;
      float prevAngle = hash1(prevSeed) * 6.2831853 + t * (0.2 + hash1(prevSeed + 1.0) * 0.3);
      float prevRadius = 0.15 + hash1(prevSeed + 2.0) * 0.25;
      vec2 prevCenter = vec2(cos(prevAngle) * prevRadius * aspect, sin(prevAngle * (0.7 + hash1(prevSeed + 3.0) * 0.6)) * prevRadius * 0.6);
      vec2 lineDir = center - prevCenter;
      vec2 toPixel = blobUV - prevCenter;
      float proj = dot(toPixel, normalize(lineDir));
      float perp = length(toPixel - proj * normalize(lineDir));
      float beam = smoothstep(0.05, 0.0, perp) * smoothstep(0.0, length(lineDir), proj) * smoothstep(length(lineDir), length(lineDir) * 0.8, proj);
      col += blobColor * beam * 0.2 * u_neonGlow;
    }
  }

  col += distort * 0.1;
  gl_FragColor = vec4(col, 1.0);
}
`;

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

    const width = container.offsetWidth;
    const height = container.offsetHeight;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Neon background shader
    const neonUniforms = {
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(width, height) },
      u_tilt: { value: 0.5 },
      u_neonGlow: { value: 1.0 },
      u_blobCount: { value: 4.0 },
      u_throb: { value: 1.0 },
    };

    const neonMaterial = new THREE.ShaderMaterial({
      vertexShader: neonVertexShader,
      fragmentShader: neonFragmentShader,
      uniforms: neonUniforms,
    });

    const plane = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(plane, neonMaterial);
    scene.add(mesh);

    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      neonUniforms.u_time.value = elapsed;
      renderer.render(scene, camera);
    };
    animate();

    // GSAP text entrance
    if (textRef.current) {
      gsap.fromTo(
        textRef.current.children,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power3.out',
          delay: 0.5,
        }
      );
    }

    const handleResize = () => {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      renderer.setSize(w, h);
      neonUniforms.u_resolution.value.set(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      neonMaterial.dispose();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
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
        }}
      />

      <div
        ref={textRef}
        className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center"
      >
        <span className="inline-block text-xs md:text-sm font-medium tracking-[0.3em] text-[#bc13fe] mb-4 uppercase opacity-0">
          Welcome to Themixhq
        </span>
        <h1 className="font-display text-[12vw] md:text-[10vw] lg:text-[8vw] font-black leading-[0.9] tracking-tight uppercase text-white opacity-0">
          THE FUTURE
        </h1>
        <h1 className="font-display text-[12vw] md:text-[10vw] lg:text-[8vw] font-black leading-[0.9] tracking-tight uppercase text-gradient-purple opacity-0">
          OF CULTURE
        </h1>
        <p className="mt-6 text-sm md:text-base text-white/50 max-w-md opacity-0">
          Your premier destination for Afrobeats, celebrity news, fashion, and
          everything shaping Nigerian pop culture.
        </p>
        <div className="flex gap-4 mt-8 opacity-0">
          <button className="px-8 py-3 bg-[#bc13fe] text-white text-xs font-semibold tracking-widest uppercase hover:bg-[#9d00ff] transition-colors duration-200">
            Explore Now
          </button>
          <button className="px-8 py-3 border border-white/20 text-white text-xs font-semibold tracking-widest uppercase hover:border-[#bc13fe] hover:text-[#bc13fe] transition-colors duration-200">
            Subscribe
          </button>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />
    </section>
  );
}
