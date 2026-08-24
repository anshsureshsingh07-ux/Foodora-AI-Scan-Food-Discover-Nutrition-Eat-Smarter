import React, { useRef, useState, useEffect } from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  tiltEffect?: boolean;
  glowEffect?: boolean;
  intensity?: "subtle" | "medium" | "heavy";
  elevation?: "low" | "medium" | "high";
  id?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  tiltEffect = true,
  glowEffect = true,
  intensity = "medium",
  elevation = "medium",
  id,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transformStyle, setTransformStyle] = useState<string>("");
  const [glarePosition, setGlarePosition] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltEffect || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const maxRotation = intensity === "heavy" ? 12 : intensity === "medium" ? 8 : 4;
    const rotateX = ((y - centerY) / centerY) * -maxRotation;
    const rotateY = ((x - centerX) / centerX) * maxRotation;

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(
        2
      )}deg) translateZ(8px)`
    );

    if (glowEffect) {
      setGlarePosition({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 0.25,
      });
    }
  };

  const handleMouseLeave = () => {
    if (!tiltEffect) return;
    setTransformStyle("perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)");
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  // Glass backdrop blur and background classes
  const glassClasses = `
    relative rounded-3xl overflow-hidden
    backdrop-blur-xl
    bg-white/60 dark:bg-slate-900/60
    border border-white/40 dark:border-white/10
    shadow-lg shadow-slate-900/5 dark:shadow-black/30
    transition-all duration-300 ease-out
  `;

  return (
    <div
      ref={cardRef}
      id={id}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      className={`${glassClasses} ${className}`}
      {...props}
    >
      {/* Specular glare reflection that follows cursor in 3D */}
      {glowEffect && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(circle 350px at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.35), transparent 70%)`,
            opacity: glarePosition.opacity,
          }}
        />
      )}

      {/* Internal highlight edge on top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/60 dark:via-white/20 to-transparent z-10" />

      {/* Card Content with 3D Depth Layer */}
      <div className="relative z-0 h-full w-full">{children}</div>
    </div>
  );
};
