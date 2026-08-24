import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Flame,
  Droplets,
  Sparkles,
  Utensils,
  Plus,
  Check,
  RefreshCw,
  Eye,
  Info,
} from "lucide-react";
import { useFood } from "../../context/FoodContext";
import { soundFx } from "../../utils/soundEffects";

type BrothType = "shoyu" | "tonkotsu" | "spicy-miso" | "matcha-pesto";

interface BrothConfig {
  name: string;
  desc: string;
  baseColor: string;
  rimColor: string;
  oilColor: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const BROTH_PRESETS: Record<BrothType, BrothConfig> = {
  shoyu: {
    name: "Tokyo Shoyu",
    desc: "Aromatic clear chicken & dashi broth infused with aged barrel soy sauce and bonito oil.",
    baseColor: "rgba(120, 53, 15, 0.88)",
    rimColor: "rgba(180, 83, 9, 0.95)",
    oilColor: "rgba(251, 191, 36, 0.7)",
    calories: 540,
    protein: 26,
    carbs: 64,
    fat: 18,
  },
  tonkotsu: {
    name: "Hakata Tonkotsu",
    desc: "Rich, creamy 18-hour collagen-rich pork bone broth with garlic oil drizzle.",
    baseColor: "rgba(245, 230, 205, 0.94)",
    rimColor: "rgba(220, 195, 160, 0.98)",
    oilColor: "rgba(180, 140, 90, 0.5)",
    calories: 680,
    protein: 34,
    carbs: 62,
    fat: 32,
  },
  "spicy-miso": {
    name: "Sapporo Spicy Miso",
    desc: "Fermented red miso with roasted chili oil, Sichuan peppercorn, and sesame paste.",
    baseColor: "rgba(185, 28, 28, 0.92)",
    rimColor: "rgba(220, 38, 38, 0.98)",
    oilColor: "rgba(249, 115, 22, 0.8)",
    calories: 620,
    protein: 30,
    carbs: 68,
    fat: 24,
  },
  "matcha-pesto": {
    name: "Kyoto Veggie Matcha",
    desc: "Velvety oat-dashi broth with ceremonial green tea, shiitake extract, and sesame.",
    baseColor: "rgba(22, 101, 52, 0.88)",
    rimColor: "rgba(34, 197, 94, 0.92)",
    oilColor: "rgba(134, 239, 172, 0.6)",
    calories: 480,
    protein: 22,
    carbs: 70,
    fat: 14,
  },
};

interface SteamParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  maxAlpha: number;
  growth: number;
  wobbleSpeed: number;
  wobbleOffset: number;
}

interface MatDroplet {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
}

export const Interactive3DRamenBowl: React.FC = () => {
  const { logFood } = useFood();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [brothType, setBrothType] = useState<BrothType>("tonkotsu");
  const [zoom, setZoom] = useState<number>(1.0);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [pitchAngle, setPitchAngle] = useState<number>(24); // degree tilt towards viewer
  const [steamBoost, setSteamBoost] = useState<boolean>(false);
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [activeToppings, setActiveToppings] = useState({
    chashu: true,
    egg: true,
    nori: true,
    naruto: true,
    scallions: true,
  });

  // Mouse interaction state for orbit drag
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotVelocityRef = useRef<number>(0.2);

  // Motion physics for container tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 260, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 260, damping: 25 });
  const rotateX = useTransform(springY, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-8deg", "8deg"]);

  // Particle systems
  const steamParticlesRef = useRef<SteamParticle[]>([]);
  const matDropletsRef = useRef<MatDroplet[]>([]);

  // Initialize placement mat water droplets
  useEffect(() => {
    const droplets: MatDroplet[] = [];
    for (let i = 0; i < 35; i++) {
      droplets.push({
        x: 30 + Math.random() * 340,
        y: 280 + Math.random() * 90,
        r: 2.5 + Math.random() * 4.5,
        vx: 0,
        vy: 0,
      });
    }
    matDropletsRef.current = droplets;
  }, []);

  // Handle logging ramen to user's meal diary
  const handleLogRamen = () => {
    soundFx.playSuccess();
    const config = BROTH_PRESETS[brothType];
    logFood({
      foodId: `ramen-3d-${brothType}`,
      foodName: `Artisanal ${config.name} Ramen Bowl`,
      mealType: "Lunch",
      servings: 1,
      grams: 480,
      calories: config.calories,
      proteinG: config.protein,
      carbsG: config.carbs,
      fatG: config.fat,
      imageUrl:
        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80",
    });
    setIsLogged(true);
    setTimeout(() => setIsLogged(false), 3000);
  };

  // Steam particle burst
  const triggerSteamBoost = () => {
    soundFx.playPop();
    setSteamBoost(true);
    // Add extra steam puffs
    for (let i = 0; i < 25; i++) {
      steamParticlesRef.current.push({
        x: 200 + (Math.random() - 0.5) * 120,
        y: 190 + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -2.0 - Math.random() * 2.5,
        radius: 12 + Math.random() * 16,
        alpha: 0.6,
        maxAlpha: 0.7,
        growth: 0.45,
        wobbleSpeed: 2 + Math.random() * 3,
        wobbleOffset: Math.random() * Math.PI * 2,
      });
    }
    setTimeout(() => setSteamBoost(false), 1200);
  };

  // 3D Canvas Rendering Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationId: number;
    let currentAngle = rotationAngle;

    const render = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const W = canvas.width;
      const H = canvas.height;
      const cX = W / 2;
      const cY = H / 2 + 15;

      // Update rotation
      if (isAutoRotating && !isDraggingRef.current) {
        currentAngle += 0.008;
      } else {
        currentAngle += rotVelocityRef.current;
        rotVelocityRef.current *= 0.94; // damping
      }

      // --- 1. RENDER GLASS PLACEMENT MAT (Frosted with Refractive Rim) ---
      ctx.save();
      const matRx = 185 * zoom;
      const matRy = 65 * zoom;
      const matY = cY + 95 * zoom;

      // Mat ambient shadow
      ctx.beginPath();
      ctx.ellipse(cX, matY + 12, matRx + 10, matRy + 8, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.filter = "blur(12px)";
      ctx.fill();
      ctx.filter = "none";

      // Frosted glass mat body
      const matGrad = ctx.createRadialGradient(cX, matY, 10, cX, matY, matRx);
      matGrad.addColorStop(0, "rgba(255, 255, 255, 0.45)");
      matGrad.addColorStop(0.7, "rgba(240, 249, 255, 0.25)");
      matGrad.addColorStop(1, "rgba(200, 230, 255, 0.15)");

      ctx.beginPath();
      ctx.ellipse(cX, matY, matRx, matRy, 0, 0, Math.PI * 2);
      ctx.fillStyle = matGrad;
      ctx.fill();

      // Frosted glass mat rim (crisp white specular edge)
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
      ctx.stroke();

      // Top edge caustic reflection
      ctx.beginPath();
      ctx.ellipse(cX, matY - 2, matRx - 4, matRy - 4, 0, Math.PI * 0.8, Math.PI * 2.2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Render condensation droplets on mat
      const droplets = matDropletsRef.current;
      for (let i = 0; i < droplets.length; i++) {
        const d = droplets[i];
        // scale with zoom relative to center
        const dx = cX + (d.x - 200) * zoom;
        const dy = matY + (d.y - 325) * zoom * 0.5;

        // Droplet shadow
        ctx.beginPath();
        ctx.arc(dx + 1, dy + 1, d.r * zoom, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
        ctx.fill();

        // Droplet body
        const dGrad = ctx.createRadialGradient(
          dx - d.r * 0.3,
          dy - d.r * 0.3,
          0.5,
          dx,
          dy,
          d.r * zoom
        );
        dGrad.addColorStop(0, "rgba(255, 255, 255, 0.9)");
        dGrad.addColorStop(0.6, "rgba(200, 235, 255, 0.3)");
        dGrad.addColorStop(1, "rgba(30, 60, 90, 0.5)");
        ctx.beginPath();
        ctx.arc(dx, dy, d.r * zoom, 0, Math.PI * 2);
        ctx.fillStyle = dGrad;
        ctx.fill();

        // Specular highlight
        ctx.beginPath();
        ctx.arc(dx - d.r * 0.35, dy - d.r * 0.35, d.r * 0.25 * zoom, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      }
      ctx.restore();

      // --- 2. RENDER 3D PORCELAIN BOWL ---
      ctx.save();
      const bowlRadiusX = 145 * zoom;
      const bowlRadiusY = 62 * zoom;
      const bowlHeight = 110 * zoom;
      const bowlTopY = cY - 20 * zoom;
      const bowlBottomY = bowlTopY + bowlHeight;

      // Deep shadow under porcelain bowl
      ctx.beginPath();
      ctx.ellipse(cX, bowlBottomY + 4, 75 * zoom, 24 * zoom, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
      ctx.filter = "blur(8px)";
      ctx.fill();
      ctx.filter = "none";

      // Outer Bowl Body Gradient (Matte ceramic / Indigo glaze)
      const bowlBodyGrad = ctx.createLinearGradient(
        cX - bowlRadiusX,
        bowlTopY,
        cX + bowlRadiusX,
        bowlBottomY
      );
      bowlBodyGrad.addColorStop(0, "#1e293b"); // dark slate ceramic
      bowlBodyGrad.addColorStop(0.3, "#0f172a");
      bowlBodyGrad.addColorStop(0.7, "#1e293b");
      bowlBodyGrad.addColorStop(1, "#334155");

      // Draw Bowl Outer Shell
      ctx.beginPath();
      ctx.moveTo(cX - bowlRadiusX, bowlTopY);
      // Left curved wall
      ctx.bezierCurveTo(
        cX - bowlRadiusX * 0.95,
        bowlTopY + bowlHeight * 0.65,
        cX - 55 * zoom,
        bowlBottomY,
        cX - 50 * zoom,
        bowlBottomY
      );
      // Bottom Foot Ring
      ctx.lineTo(cX + 50 * zoom, bowlBottomY);
      // Right curved wall
      ctx.bezierCurveTo(
        cX + 55 * zoom,
        bowlBottomY,
        cX + bowlRadiusX * 0.95,
        bowlTopY + bowlHeight * 0.65,
        cX + bowlRadiusX,
        bowlTopY
      );
      // Complete bottom cap
      ctx.ellipse(cX, bowlTopY, bowlRadiusX, bowlRadiusY, 0, 0, Math.PI);
      ctx.fillStyle = bowlBodyGrad;
      ctx.fill();

      // Porcelain Decorative Waves / Gold Ring on exterior
      ctx.beginPath();
      ctx.ellipse(cX, bowlTopY + 35 * zoom, bowlRadiusX * 0.88, bowlRadiusY * 0.88, 0, 0, Math.PI);
      ctx.strokeStyle = "rgba(234, 179, 8, 0.4)"; // Gold traditional accent line
      ctx.lineWidth = 2.5 * zoom;
      ctx.stroke();

      // Foot Ring highlight
      ctx.beginPath();
      ctx.ellipse(cX, bowlBottomY, 50 * zoom, 12 * zoom, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#090d16";
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.stroke();

      // --- 3. INNER BOWL & STEAMING BROTH ---
      // Inner porcelain rim
      ctx.beginPath();
      ctx.ellipse(cX, bowlTopY, bowlRadiusX, bowlRadiusY, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#0f172a";
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 3 * zoom;
      ctx.stroke();

      // Broth Surface (Slightly below the rim)
      const brothRx = (bowlRadiusX - 10) * zoom;
      const brothRy = (bowlRadiusY - 8) * zoom;
      const brothY = bowlTopY + 6 * zoom;

      const brothConfig = BROTH_PRESETS[brothType];
      const brothGrad = ctx.createRadialGradient(
        cX - 25 * zoom,
        brothY - 10 * zoom,
        15 * zoom,
        cX,
        brothY,
        brothRx
      );
      brothGrad.addColorStop(0, brothConfig.oilColor);
      brothGrad.addColorStop(0.4, brothConfig.baseColor);
      brothGrad.addColorStop(1, brothConfig.rimColor);

      ctx.beginPath();
      ctx.ellipse(cX, brothY, brothRx, brothRy, 0, 0, Math.PI * 2);
      ctx.fillStyle = brothGrad;
      ctx.fill();

      // Aromatic Oil droplets floating on soup surface (Schmaltz/Chili oil)
      for (let k = 0; k < 12; k++) {
        const oilAngle = k * 0.52 + currentAngle * 0.5;
        const oilDist = (20 + (k % 4) * 22) * zoom;
        const ox = cX + Math.cos(oilAngle) * oilDist;
        const oy = brothY + Math.sin(oilAngle) * (oilDist * 0.42);
        const or = (2.5 + (k % 3) * 1.8) * zoom;

        ctx.beginPath();
        ctx.ellipse(ox, oy, or, or * 0.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = brothConfig.oilColor;
        ctx.fill();
      }

      // --- 4. TOPPINGS (Calculated in 3D Rotational Space around Broth Center) ---
      // Toppings coordinate helper
      const getToppingPos = (baseAngle: number, distance: number) => {
        const theta = baseAngle + currentAngle;
        const x = cX + Math.cos(theta) * distance * zoom;
        const y = brothY + Math.sin(theta) * (distance * 0.42) * zoom;
        const depth = Math.sin(theta); // -1 (back) to +1 (front)
        return { x, y, depth, theta };
      };

      // 4A. Nori Sheet (Dark seaweed, upright against the back rim)
      if (activeToppings.nori) {
        const noriPos = getToppingPos(Math.PI * 1.25, 80);
        ctx.save();
        ctx.translate(noriPos.x, noriPos.y);
        ctx.rotate(-0.15 + Math.sin(currentAngle) * 0.05);

        ctx.beginPath();
        ctx.roundRect(-22 * zoom, -42 * zoom, 44 * zoom, 48 * zoom, 4);
        ctx.fillStyle = "#14241c"; // deep dark green/black
        ctx.fill();
        ctx.strokeStyle = "rgba(40, 70, 50, 0.6)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Nori roasted texture speckles
        ctx.fillStyle = "rgba(74, 222, 128, 0.15)";
        ctx.fillRect(-15 * zoom, -35 * zoom, 12 * zoom, 25 * zoom);
        ctx.restore();
      }

      // 4B. Chashu Pork Slices (Tender seared pork belly with charred edges)
      if (activeToppings.chashu) {
        // Slice 1
        const chashu1 = getToppingPos(Math.PI * 0.6, 50);
        ctx.save();
        ctx.translate(chashu1.x, chashu1.y);
        ctx.rotate(0.3 + currentAngle * 0.2);

        // Chashu outer disc
        ctx.beginPath();
        ctx.ellipse(0, 0, 32 * zoom, 22 * zoom, -0.2, 0, Math.PI * 2);
        ctx.fillStyle = "#b45309"; // seared marinade
        ctx.fill();
        ctx.strokeStyle = "#78350f";
        ctx.lineWidth = 2 * zoom;
        ctx.stroke();

        // Inner meat & fat spiral
        ctx.beginPath();
        ctx.ellipse(0, 0, 25 * zoom, 16 * zoom, -0.2, 0, Math.PI * 2);
        ctx.fillStyle = "#d97706";
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(3 * zoom, 1 * zoom, 14 * zoom, 8 * zoom, -0.2, 0, Math.PI * 2);
        ctx.fillStyle = "#fef3c7"; // succulent pork fat
        ctx.fill();
        ctx.restore();

        // Slice 2 (Overlapping)
        const chashu2 = getToppingPos(Math.PI * 0.85, 55);
        ctx.save();
        ctx.translate(chashu2.x, chashu2.y);
        ctx.rotate(-0.25 + currentAngle * 0.2);

        ctx.beginPath();
        ctx.ellipse(0, 0, 30 * zoom, 20 * zoom, 0.3, 0, Math.PI * 2);
        ctx.fillStyle = "#9a3412";
        ctx.fill();
        ctx.strokeStyle = "#78350f";
        ctx.lineWidth = 1.8 * zoom;
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(0, 0, 22 * zoom, 14 * zoom, 0.3, 0, Math.PI * 2);
        ctx.fillStyle = "#ea580c";
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(2 * zoom, -1 * zoom, 12 * zoom, 6 * zoom, 0.3, 0, Math.PI * 2);
        ctx.fillStyle = "#ffedd5";
        ctx.fill();
        ctx.restore();
      }

      // 4C. Ajitsuke Tamago (Marinated Soft-Boiled Egg Halves with Jammy Yolk)
      if (activeToppings.egg) {
        const eggPos = getToppingPos(Math.PI * 1.8, 52);
        ctx.save();
        ctx.translate(eggPos.x, eggPos.y);
        ctx.rotate(-0.35);

        // Egg white marinated outer
        ctx.beginPath();
        ctx.ellipse(0, 0, 26 * zoom, 19 * zoom, 0.15, 0, Math.PI * 2);
        ctx.fillStyle = "#fef9c3"; // egg white
        ctx.fill();
        ctx.strokeStyle = "#ca8a04"; // soy-marinated brown edge
        ctx.lineWidth = 2.5 * zoom;
        ctx.stroke();

        // Jammy Golden Liquid Yolk
        const yolkGrad = ctx.createRadialGradient(
          -2 * zoom,
          -2 * zoom,
          2 * zoom,
          0,
          0,
          13 * zoom
        );
        yolkGrad.addColorStop(0, "#fef08a");
        yolkGrad.addColorStop(0.35, "#f59e0b");
        yolkGrad.addColorStop(0.85, "#ea580c"); // deep orange center
        yolkGrad.addColorStop(1, "#c2410c");

        ctx.beginPath();
        ctx.ellipse(0, 0, 14 * zoom, 11 * zoom, 0.15, 0, Math.PI * 2);
        ctx.fillStyle = yolkGrad;
        ctx.fill();

        // Glossy specular shine on yolk
        ctx.beginPath();
        ctx.ellipse(-3 * zoom, -3 * zoom, 4 * zoom, 2 * zoom, -0.4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.fill();
        ctx.restore();
      }

      // 4D. Narutomaki (White Fish Cake with Pink Spiral)
      if (activeToppings.naruto) {
        const narutoPos = getToppingPos(Math.PI * 0.1, 60);
        ctx.save();
        ctx.translate(narutoPos.x, narutoPos.y);
        ctx.rotate(0.2);

        // White serrated fish cake base
        ctx.beginPath();
        ctx.ellipse(0, 0, 16 * zoom, 12 * zoom, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.strokeStyle = "#fbcfe8";
        ctx.lineWidth = 1.5 * zoom;
        ctx.stroke();

        // Pink iconic spiral
        ctx.beginPath();
        ctx.arc(0, 0, 6 * zoom, 0, Math.PI * 1.7, false);
        ctx.strokeStyle = "#ec4899";
        ctx.lineWidth = 2.5 * zoom;
        ctx.stroke();
        ctx.restore();
      }

      // 4E. Chopped Negi / Scallions & Sesame Seeds in center
      if (activeToppings.scallions) {
        const negiPos = getToppingPos(0, 15);
        ctx.save();
        ctx.translate(negiPos.x, negiPos.y);

        // Scattered vibrant green onion rings
        const greenShades = ["#22c55e", "#16a34a", "#4ade80", "#15803d"];
        for (let s = 0; s < 18; s++) {
          const sx = Math.sin(s * 1.3) * 22 * zoom;
          const sy = Math.cos(s * 1.7) * 12 * zoom;
          const sr = (2.5 + (s % 3)) * zoom;

          ctx.beginPath();
          ctx.ellipse(sx, sy, sr, sr * 0.6, s * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = greenShades[s % greenShades.length];
          ctx.fill();
          ctx.strokeStyle = "#14532d";
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }

        // White toasted sesame seeds
        ctx.fillStyle = "#fef08a";
        for (let sm = 0; sm < 14; sm++) {
          const smx = Math.cos(sm * 2.1) * 35 * zoom;
          const smy = Math.sin(sm * 1.9) * 16 * zoom;
          ctx.fillRect(smx, smy, 1.8 * zoom, 1.2 * zoom);
        }
        ctx.restore();
      }

      // --- 5. RISING HOT STEAM PARTICLE SIMULATION ---
      const particles = steamParticlesRef.current;

      // Spawn ambient steam constantly
      if (Math.random() < (steamBoost ? 0.95 : 0.4)) {
        particles.push({
          x: cX + (Math.random() - 0.5) * (brothRx * 1.2),
          y: brothY + (Math.random() - 0.5) * (brothRy * 0.5),
          vx: (Math.random() - 0.5) * 0.6,
          vy: -1.2 - Math.random() * (steamBoost ? 2.2 : 1.2),
          radius: 10 + Math.random() * 12,
          alpha: 0.05,
          maxAlpha: 0.35 + Math.random() * 0.25,
          growth: 0.25 + Math.random() * 0.2,
          wobbleSpeed: 1.5 + Math.random() * 2.0,
          wobbleOffset: Math.random() * Math.PI * 2,
        });
      }

      // Update & Draw steam wisps
      for (let p = particles.length - 1; p >= 0; p--) {
        const pt = particles[p];

        pt.y += pt.vy;
        pt.x += pt.vx + Math.sin(time * 0.003 * pt.wobbleSpeed + pt.wobbleOffset) * 0.6;
        pt.radius += pt.growth;

        // Fade in then out smoothly
        if (pt.y > brothY - 40) {
          pt.alpha = Math.min(pt.maxAlpha, pt.alpha + 0.02);
        } else {
          pt.alpha -= 0.006;
        }

        if (pt.alpha <= 0 || pt.y < 10) {
          particles.splice(p, 1);
          continue;
        }

        const steamGrad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, pt.radius);
        steamGrad.addColorStop(0, `rgba(255, 255, 255, ${pt.alpha * 0.8})`);
        steamGrad.addColorStop(0.5, `rgba(240, 248, 255, ${pt.alpha * 0.4})`);
        steamGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
        ctx.fillStyle = steamGrad;
        ctx.fill();
      }

      ctx.restore();
      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [brothType, zoom, isAutoRotating, activeToppings, steamBoost]);

  // Pointer drag orbit controls
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    setIsAutoRotating(false);
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    rotVelocityRef.current = dx * 0.008;
    setRotationAngle((prev) => prev + rotVelocityRef.current);
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Container Parallax Tilt
  const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleContainerMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    isDraggingRef.current = false;
  };

  const currentBroth = BROTH_PRESETS[brothType];

  return (
    <motion.div
      ref={containerRef}
      id="3d-interactive-ramen-hero"
      onMouseMove={handleContainerMouseMove}
      onMouseLeave={handleContainerMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className="relative w-full rounded-[36px] backdrop-blur-2xl bg-gradient-to-b from-white/80 via-white/60 to-slate-900/40 dark:from-slate-900/85 dark:via-slate-950/80 dark:to-black/85 border border-white/60 dark:border-white/15 shadow-2xl shadow-emerald-950/10 dark:shadow-black/60 overflow-hidden flex flex-col transition-all duration-300"
    >
      {/* Top Specular Glass Highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent z-20" />

      {/* Top Bar with Status & Interactive Controls */}
      <div className="relative z-20 px-5 sm:px-6 pt-5 pb-2 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/50 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-sm">
            🍜
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-none">
                {currentBroth.name}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-300/60 dark:border-emerald-800/60">
                3D Live Sim
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">
              Interactive 60fps canvas • Drag to orbit 360°
            </p>
          </div>
        </div>

        {/* Orbit, Zoom & Steam Controls Toolbar */}
        <div className="flex items-center gap-1.5 bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-md p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`p-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isAutoRotating
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
            title={isAutoRotating ? "Pause Auto-Rotation" : "Resume Auto-Rotation"}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAutoRotating ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => setZoom((z) => Math.min(1.25, z + 0.1))}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setZoom((z) => Math.max(0.8, z - 0.1))}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={triggerSteamBoost}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              steamBoost
                ? "bg-amber-500 text-white animate-pulse"
                : "bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900 border border-amber-300 dark:border-amber-800"
            }`}
            title="Puff Hot Aromatic Steam"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Steam</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Stage */}
      <div className="relative w-full h-[320px] sm:h-[350px] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing">
        {/* Subtle Ambient Radial Lighting */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_70%)]" />

        <canvas
          ref={canvasRef}
          width={420}
          height={380}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative z-10 w-full h-full max-w-[420px] max-h-[380px] touch-none select-none"
        />

        {/* Drag Hint Tooltip */}
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full backdrop-blur-md bg-slate-900/60 text-white/80 text-[10px] font-bold border border-white/10 tracking-wide flex items-center gap-1.5">
          <RotateCcw className="w-3 h-3 text-emerald-400" />
          <span>Drag bowl to spin 3D view</span>
        </div>
      </div>

      {/* Broth Selector Tabs */}
      <div className="relative z-20 px-5 sm:px-6 pb-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-100/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800">
          {(Object.keys(BROTH_PRESETS) as BrothType[]).map((key) => {
            const preset = BROTH_PRESETS[key];
            const isSelected = brothType === key;
            return (
              <button
                key={key}
                onClick={() => {
                  soundFx.playPop();
                  setBrothType(key);
                }}
                className={`py-1.5 px-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer truncate ${
                  isSelected
                    ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {preset.name.split(" ")[1]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Topping Toggles Ribbon */}
      <div className="relative z-20 px-5 sm:px-6 py-2 flex items-center justify-between gap-2 overflow-x-auto text-xs scrollbar-none">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">
          Toppings:
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { key: "chashu", label: "🥩 Chashu" },
            { key: "egg", label: "🥚 Ajitsuke Egg" },
            { key: "nori", label: "🌿 Nori" },
            { key: "naruto", label: "🍥 Naruto" },
            { key: "scallions", label: "🌱 Scallions" },
          ].map((t) => {
            const active = activeToppings[t.key as keyof typeof activeToppings];
            return (
              <button
                key={t.key}
                onClick={() => {
                  soundFx.playPop();
                  setActiveToppings((prev) => ({
                    ...prev,
                    [t.key]: !active,
                  }));
                }}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all border cursor-pointer ${
                  active
                    ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                    : "bg-slate-100/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 line-through opacity-60"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Nutritional HUD & Log Meal Action */}
      <div className="relative z-20 p-5 sm:p-6 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200/60 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Macro Pillars */}
        <div className="flex items-center gap-5 w-full sm:w-auto justify-between sm:justify-start">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Calories</span>
            <span className="text-lg font-black text-slate-900 dark:text-white leading-none">
              {currentBroth.calories}{" "}
              <span className="text-xs font-normal text-slate-400">kcal</span>
            </span>
          </div>

          <div className="h-7 w-[1px] bg-slate-200 dark:bg-slate-800" />

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Protein</span>
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 leading-none">
              {currentBroth.protein}g
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Carbs</span>
            <span className="text-sm font-black text-amber-500 leading-none">
              {currentBroth.carbs}g
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Fats</span>
            <span className="text-sm font-black text-sky-500 leading-none">
              {currentBroth.fat}g
            </span>
          </div>
        </div>

        {/* 1-Click Log Button */}
        <button
          id="log-3d-ramen-btn"
          onClick={handleLogRamen}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer ${
            isLogged
              ? "bg-emerald-600 text-white shadow-emerald-500/25"
              : "bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 shadow-slate-900/20"
          }`}
        >
          {isLogged ? (
            <>
              <Check className="w-4 h-4" />
              <span>Logged to Meal Diary!</span>
            </>
          ) : (
            <>
              <Utensils className="w-4 h-4" />
              <span>Log Artisanal Ramen (+{currentBroth.calories} kcal)</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
