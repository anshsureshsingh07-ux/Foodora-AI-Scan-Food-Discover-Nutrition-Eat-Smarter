import React, { useEffect, useRef, useState, useCallback } from "react";
import { Droplets, Sparkles, CloudRain, Trash2, Sliders, Eye, EyeOff } from "lucide-react";

interface Droplet {
  id: number;
  x: number;
  y: number;
  radius: number;
  targetRadius: number;
  vx: number;
  vy: number;
  opacity: number;
  mass: number;
  isMerging?: boolean;
  trail: { x: number; y: number; radius: number; alpha: number }[];
  life: number;
  highlightAngle: number;
}

interface WaterDropletsProps {
  initialCount?: number;
  interactive?: boolean;
  enableGravity?: boolean;
  density?: "low" | "medium" | "high";
}

export const WaterDropletsCanvas: React.FC<WaterDropletsProps> = ({
  initialCount = 45,
  interactive = true,
  enableGravity = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const [gravity, setGravity] = useState(enableGravity);
  const [dropletCount, setDropletCount] = useState<number>(initialCount);
  const [showControls, setShowControls] = useState(false);
  const [wipeAnimation, setWipeAnimation] = useState(false);

  const dropletsRef = useRef<Droplet[]>([]);
  const mouseRef = useRef<{
    x: number;
    y: number;
    prevX: number;
    prevY: number;
    vx: number;
    vy: number;
    isDown: boolean;
    active: boolean;
  }>({
    x: -1000,
    y: -1000,
    prevX: -1000,
    prevY: -1000,
    vx: 0,
    vy: 0,
    isDown: false,
    active: false,
  });

  const nextIdRef = useRef(1);

  // Initialize random realistic droplets across the viewport
  const spawnDroplets = useCallback((count: number, width: number, height: number, clear = false) => {
    if (clear) {
      dropletsRef.current = [];
    }

    const newDroplets: Droplet[] = [];
    for (let i = 0; i < count; i++) {
      // Natural distribution: lots of tiny droplets, fewer medium ones, rare large ones
      const rand = Math.random();
      let r = 3 + Math.random() * 4;
      if (rand > 0.85) r = 8 + Math.random() * 7;
      else if (rand > 0.6) r = 5 + Math.random() * 4;

      newDroplets.push({
        id: nextIdRef.current++,
        x: Math.random() * width,
        y: Math.random() * height,
        radius: r,
        targetRadius: r,
        vx: 0,
        vy: 0,
        opacity: 0.8 + Math.random() * 0.2,
        mass: r * r * 0.1,
        trail: [],
        life: 1.0,
        highlightAngle: Math.PI * 0.25 + (Math.random() - 0.5) * 0.2,
      });
    }

    dropletsRef.current = [...dropletsRef.current, ...newDroplets];
  }, []);

  // Spawn splash at specific coordinates
  const spawnSplashAt = (x: number, y: number, count = 8) => {
    const splashDroplets: Droplet[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 5 + Math.random() * 35;
      const r = 2.5 + Math.random() * 4.5;
      splashDroplets.push({
        id: nextIdRef.current++,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        radius: r,
        targetRadius: r,
        vx: Math.cos(angle) * (1 + Math.random() * 2),
        vy: Math.sin(angle) * (1 + Math.random() * 2),
        opacity: 0.9,
        mass: r * r * 0.1,
        trail: [],
        life: 1.0,
        highlightAngle: Math.PI * 0.25,
      });
    }
    dropletsRef.current = [...dropletsRef.current, ...splashDroplets];
  };

  // Wipe all droplets smoothly
  const wipeGlass = () => {
    setWipeAnimation(true);
    setTimeout(() => {
      dropletsRef.current = [];
      setWipeAnimation(false);
      // Respawn fresh minimal dew
      if (canvasRef.current) {
        spawnDroplets(15, canvasRef.current.width, canvasRef.current.height, true);
      }
    }, 400);
  };

  // Rain Shower: sprinkle fresh droplets
  const rainShower = () => {
    if (!canvasRef.current) return;
    const w = canvasRef.current.width;
    const h = canvasRef.current.height;
    spawnDroplets(30, w, h, false);
  };

  // Setup Canvas & Event Listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Initial population
    spawnDroplets(dropletCount, width, height, true);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Mouse / Touch tracking across whole window
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ("touches" in e) {
        if (e.touches.length > 0) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        }
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const mouse = mouseRef.current;
      mouse.vx = clientX - mouse.x;
      mouse.vy = clientY - mouse.y;
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      mouse.x = clientX;
      mouse.y = clientY;
      mouse.active = true;
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      mouseRef.current.isDown = true;
      let clientX = 0;
      let clientY = 0;
      if ("touches" in e) {
        if (e.touches.length > 0) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        }
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      mouseRef.current.x = clientX;
      mouseRef.current.y = clientY;
    };

    const handlePointerUp = () => {
      mouseRef.current.isDown = false;
    };

    const handlePointerLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("mousedown", handlePointerDown, { passive: true });
    window.addEventListener("touchstart", handlePointerDown, { passive: true });
    window.addEventListener("mouseup", handlePointerUp, { passive: true });
    window.addEventListener("touchend", handlePointerUp, { passive: true });
    window.addEventListener("mouseleave", handlePointerLeave, { passive: true });

    // Main 60fps render & physics loop
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      if (isEnabled && dropletsRef.current.length > 0) {
        const mouse = mouseRef.current;
        const droplets = dropletsRef.current;

        // Physics update
        for (let i = 0; i < droplets.length; i++) {
          const d = droplets[i];

          // Smooth radius expansion (e.g. after merging)
          if (d.radius < d.targetRadius) {
            d.radius += (d.targetRadius - d.radius) * 0.15;
          }

          // Mouse / Cursor interaction: surface push & attraction
          if (mouse.active && interactive) {
            const dx = mouse.x - d.x;
            const dy = mouse.y - d.y;
            const dist = Math.hypot(dx, dy);
            const interactDist = d.radius + (mouse.isDown ? 45 : 30);

            if (dist < interactDist && dist > 0.01) {
              const force = (interactDist - dist) / interactDist;
              // If moving fast, push droplet along with velocity (smear/drag)
              const mouseSpeed = Math.hypot(mouse.vx, mouse.vy);

              if (mouseSpeed > 2) {
                d.vx += (mouse.vx * 0.15 + (dx / dist) * -1.5) * force;
                d.vy += (mouse.vy * 0.15 + (dy / dist) * -1.5) * force;

                // Leave subtle condensation trail when dragged
                if (d.radius > 6 && Math.random() > 0.6) {
                  d.trail.push({
                    x: d.x,
                    y: d.y,
                    radius: d.radius * 0.35,
                    alpha: 0.5,
                  });
                  if (d.trail.length > 8) d.trail.shift();
                }
              } else {
                // Gentle surface tension wobble
                d.vx += (dx / dist) * force * 0.8;
                d.vy += (dy / dist) * force * 0.8;
              }
            }
          }

          // Gravity effect (trickling down glass)
          if (gravity || d.radius > 11) {
            // Larger droplets feel more gravity pull
            const gravityScale = d.radius > 10 ? 0.35 : 0.08;
            d.vy += gravityScale;

            // Drip trails
            if (Math.abs(d.vy) > 1.2 && Math.random() > 0.5) {
              d.trail.push({
                x: d.x + (Math.random() - 0.5) * (d.radius * 0.3),
                y: d.y,
                radius: Math.max(1.5, d.radius * 0.25),
                alpha: 0.6,
              });
              if (d.trail.length > 10) d.trail.shift();
            }
          }

          // Natural friction / air resistance
          d.vx *= 0.92;
          d.vy *= 0.92;

          d.x += d.vx;
          d.y += d.vy;

          // Fade trails
          for (let t = 0; t < d.trail.length; t++) {
            d.trail[t].alpha *= 0.97;
          }
          d.trail = d.trail.filter((t) => t.alpha > 0.05);

          // Wrap or bounce edges
          if (d.x < -d.radius) d.x = width + d.radius;
          if (d.x > width + d.radius) d.x = -d.radius;
          if (d.y > height + d.radius) {
            if (gravity) {
              d.y = -d.radius;
              d.x = Math.random() * width;
              d.vy = 0;
            } else {
              d.y = height + d.radius;
            }
          }
        }

        // Droplet Merging / Coalescence logic
        for (let i = 0; i < droplets.length; i++) {
          const d1 = droplets[i];
          if (!d1) continue;

          for (let j = i + 1; j < droplets.length; j++) {
            const d2 = droplets[j];
            if (!d2) continue;

            const dx = d2.x - d1.x;
            const dy = d2.y - d1.y;
            const dist = Math.hypot(dx, dy);

            // If touching or overlapping
            if (dist < d1.radius + d2.radius - 1) {
              // Merge into larger droplet
              const totalArea = Math.PI * d1.radius * d1.radius + Math.PI * d2.radius * d2.radius;
              const newRadius = Math.min(24, Math.sqrt(totalArea / Math.PI));

              // Center of mass
              const w1 = d1.radius / (d1.radius + d2.radius);
              const w2 = 1 - w1;
              d1.x = d1.x * w1 + d2.x * w2;
              d1.y = d1.y * w1 + d2.y * w2;
              d1.vx = (d1.vx + d2.vx) * 0.6;
              d1.vy = (d1.vy + d2.vy) * 0.6 + 0.3; // subtle downward momentum on merge
              d1.targetRadius = newRadius;
              d1.radius = Math.max(d1.radius, d2.radius);

              // Remove d2
              droplets.splice(j, 1);
              j--;
            }
          }
        }

        // Limit droplet pool to prevent unbounded growth
        if (droplets.length > 120) {
          droplets.splice(0, droplets.length - 120);
        }

        // DRAWING PHASE: Realistic Optical Water Droplets with Refraction & Specular Glint
        for (let i = 0; i < droplets.length; i++) {
          const d = droplets[i];

          // 1. Draw trails if any
          for (let t = 0; t < d.trail.length; t++) {
            const tr = d.trail[t];
            ctx.beginPath();
            ctx.arc(tr.x, tr.y, tr.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${tr.alpha * 0.25})`;
            ctx.fill();
          }

          const r = d.radius;
          const x = d.x;
          const y = d.y;

          // 2. Drop Shadow underneath droplet (soft ambient occlusion)
          ctx.save();
          ctx.beginPath();
          ctx.arc(x + r * 0.2, y + r * 0.25, r * 1.05, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
          ctx.filter = `blur(${Math.max(1, r * 0.3)}px)`;
          ctx.fill();
          ctx.restore();

          // 3. Main Droplet Body (Refractive Dark Rim + Caustic Glow)
          // Refractive gradient creates the illusion of magnifying the background
          const bodyGrad = ctx.createRadialGradient(
            x - r * 0.3,
            y - r * 0.3,
            r * 0.1,
            x,
            y,
            r
          );
          bodyGrad.addColorStop(0, "rgba(255, 255, 255, 0.55)"); // Center lightness
          bodyGrad.addColorStop(0.5, "rgba(235, 248, 255, 0.2)"); // Clear water body
          bodyGrad.addColorStop(0.85, "rgba(100, 150, 200, 0.15)"); // Tinted edge
          bodyGrad.addColorStop(1, "rgba(20, 40, 60, 0.45)"); // Dark refractive meniscus ring

          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = bodyGrad;
          ctx.fill();

          // 4. Subtle Inner Glow / Caustic Light at Bottom-Right
          const causticGrad = ctx.createRadialGradient(
            x + r * 0.35,
            y + r * 0.35,
            r * 0.05,
            x + r * 0.35,
            y + r * 0.35,
            r * 0.5
          );
          causticGrad.addColorStop(0, "rgba(255, 255, 255, 0.75)");
          causticGrad.addColorStop(0.5, "rgba(180, 230, 255, 0.35)");
          causticGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

          ctx.beginPath();
          ctx.arc(x + r * 0.3, y + r * 0.3, r * 0.45, 0, Math.PI * 2);
          ctx.fillStyle = causticGrad;
          ctx.fill();

          // 5. Specular Highlights (Top-Left primary sharp glint + secondary soft glint)
          // Primary highlight glint
          const hX = x - r * 0.35;
          const hY = y - r * 0.35;
          const hRadius = Math.max(1, r * 0.22);

          ctx.beginPath();
          ctx.ellipse(hX, hY, hRadius * 1.3, hRadius * 0.8, -Math.PI / 4, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
          ctx.fill();

          // Tiny secondary glint for extra realism
          if (r > 6) {
            ctx.beginPath();
            ctx.arc(x - r * 0.1, y - r * 0.45, r * 0.08, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchend", handlePointerUp);
      window.removeEventListener("mouseleave", handlePointerLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isEnabled, gravity, dropletCount, interactive, spawnDroplets]);

  return (
    <>
      {/* Interactive Water Droplets Canvas (fixed across full viewport, click-through enabled) */}
      <canvas
        ref={canvasRef}
        id="water-droplets-canvas"
        className={`fixed inset-0 w-full h-full pointer-events-none z-20 transition-opacity duration-500 ${
          wipeAnimation ? "opacity-20 scale-105" : "opacity-100"
        } ${isEnabled ? "block" : "hidden"}`}
        style={{
          transform: "translate3d(0, 0, 0)",
          willChange: "transform, opacity",
        }}
      />

      {/* Floating Glassmorphic Water & 3D Interactive Control Floating Widget */}
      <aside
        aria-label="Water droplets and glassmorphism settings"
        className="fixed bottom-5 right-4 sm:right-6 z-40 flex flex-col items-end gap-2 pointer-events-auto"
      >
        {showControls && (
          <div
            id="water-droplets-control-panel"
            className="p-4 rounded-3xl backdrop-blur-2xl bg-white/80 dark:bg-slate-900/85 border border-white/60 dark:border-white/10 shadow-2xl shadow-emerald-950/15 dark:shadow-black/60 text-slate-800 dark:text-slate-100 text-xs w-64 space-y-3.5 animate-in fade-in slide-in-from-bottom-3 duration-200"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800/80">
              <div className="flex items-center gap-2 font-extrabold text-emerald-600 dark:text-emerald-400">
                <Droplets className="w-4 h-4" />
                <span className="text-sm">Glass & Droplets FX</span>
              </div>
              <button
                onClick={() => setShowControls(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Enable/Disable Toggle */}
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Water Droplets</span>
              <button
                onClick={() => setIsEnabled(!isEnabled)}
                className={`px-3 py-1 rounded-full font-bold text-[11px] transition-all cursor-pointer ${
                  isEnabled
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                }`}
              >
                {isEnabled ? "Active" : "Paused"}
              </button>
            </div>

            {/* Gravity Mode Toggle */}
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Gravity & Drip</span>
              <button
                onClick={() => setGravity(!gravity)}
                className={`px-3 py-1 rounded-full font-bold text-[11px] transition-all cursor-pointer ${
                  gravity
                    ? "bg-sky-600 text-white shadow-xs"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                }`}
              >
                {gravity ? "Dripping" : "Surface Dew"}
              </button>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={rainShower}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] cursor-pointer transition-all active:scale-95"
              >
                <CloudRain className="w-3.5 h-3.5" />
                <span>+ Rain Mist</span>
              </button>

              <button
                onClick={wipeGlass}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 font-bold text-[11px] cursor-pointer transition-all active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Wipe Clean</span>
              </button>
            </div>

            <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center leading-tight">
              Hover, drag, or tap to merge water droplets on the glass in real-time.
            </p>
          </div>
        )}

        {/* Floating Trigger Pill */}
        <button
          id="toggle-droplets-fab"
          onClick={() => setShowControls((prev) => !prev)}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-full backdrop-blur-xl border shadow-lg transition-all duration-300 cursor-pointer active:scale-95 ${
            isEnabled
              ? "bg-white/80 dark:bg-slate-900/80 border-emerald-500/50 dark:border-emerald-400/40 text-emerald-700 dark:text-emerald-300 shadow-emerald-500/15"
              : "bg-white/60 dark:bg-slate-900/60 border-slate-300 dark:border-slate-700 text-slate-500"
          }`}
          title="Interactive Glass & Water Droplets Physics Settings"
        >
          <div className="relative">
            <Droplets className="w-4 h-4 text-emerald-500 dark:text-emerald-400 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-sky-400 rounded-full animate-ping" />
          </div>
          <span className="text-xs font-extrabold hidden sm:inline">
            {isEnabled ? "Water Glass FX" : "FX Off"}
          </span>
          <Sliders className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
        </button>
      </aside>
    </>
  );
};
