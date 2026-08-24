import React, { useEffect, useState } from "react";

export const GlassBackgroundBlobs: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      style={{
        transform: "translate3d(0,0,0)",
      }}
    >
      {/* Top Emerald/Teal Caustic Glow (moves gently on scroll) */}
      <div
        className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-emerald-400/25 to-teal-300/15 dark:from-emerald-600/15 dark:to-teal-500/10 blur-3xl transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(0px, ${scrollY * 0.12}px, 0px)`,
        }}
      />

      {/* Center-Right Cyan / Sky Atmospheric Orb */}
      <div
        className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-sky-400/20 to-indigo-400/15 dark:from-sky-600/15 dark:to-indigo-600/10 blur-3xl transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(0px, ${scrollY * -0.15}px, 0px)`,
        }}
      />

      {/* Bottom Amber / Violet Warm Accent */}
      <div
        className="absolute -bottom-40 left-1/4 w-[650px] h-[650px] rounded-full bg-gradient-to-t from-amber-400/15 via-emerald-400/10 to-transparent dark:from-purple-900/15 dark:via-emerald-950/10 blur-3xl transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(0px, ${scrollY * 0.08}px, 0px)`,
        }}
      />

      {/* Subtle Refractive SVG Noise Mesh for Crystal Texture */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.015] dark:opacity-[0.03]">
        <filter id="glass-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#glass-noise)" />
      </svg>
    </div>
  );
};
