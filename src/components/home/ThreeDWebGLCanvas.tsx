import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

export type BrothKey = "shoyu" | "tonkotsu" | "spicy-miso" | "matcha-pesto" | "black-garlic";

export interface ToppingConfig {
  chashu: boolean;
  tamago: boolean;
  nori: boolean;
  naruto: boolean;
  scallions: boolean;
  mushrooms: boolean;
  menma: boolean;
  chiliOil: boolean;
}

export interface ThreeDWebGLProps {
  broth: BrothKey;
  toppings: ToppingConfig;
  isSteamActive: boolean;
  isAutoRotate: boolean;
  cameraPreset: "perspective" | "top" | "side" | "closeup";
  onMeshHover?: (item: string | null) => void;
  className?: string;
}

// Color palettes for broth and lighting
const BROTH_THEMES: Record<
  BrothKey,
  {
    liquidColor: number;
    roughness: number;
    metalness: number;
    clearcoat: number;
    lightColor: number;
    particleTint: number;
  }
> = {
  shoyu: {
    liquidColor: 0x4a1e05,
    roughness: 0.1,
    metalness: 0.15,
    clearcoat: 0.9,
    lightColor: 0xffaa44,
    particleTint: 0xffeedd,
  },
  tonkotsu: {
    liquidColor: 0xf3e5d0,
    roughness: 0.35,
    metalness: 0.05,
    clearcoat: 0.6,
    lightColor: 0xffeed0,
    particleTint: 0xffffff,
  },
  "spicy-miso": {
    liquidColor: 0x9b1c1c,
    roughness: 0.2,
    metalness: 0.2,
    clearcoat: 0.85,
    lightColor: 0xff4422,
    particleTint: 0xffccaa,
  },
  "matcha-pesto": {
    liquidColor: 0x1c5a27,
    roughness: 0.25,
    metalness: 0.1,
    clearcoat: 0.8,
    lightColor: 0x44ff77,
    particleTint: 0xddffdd,
  },
  "black-garlic": {
    liquidColor: 0x1f1917,
    roughness: 0.15,
    metalness: 0.4,
    clearcoat: 0.95,
    lightColor: 0xcc8833,
    particleTint: 0xffeecc,
  },
};

export const ThreeDWebGLCanvas: React.FC<ThreeDWebGLProps> = ({
  broth,
  toppings,
  isSteamActive,
  isAutoRotate,
  cameraPreset,
  onMeshHover,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Model References
  const foodGroupRef = useRef<THREE.Group | null>(null);
  const brothMeshRef = useRef<THREE.Mesh | null>(null);
  const brothLightRef = useRef<THREE.PointLight | null>(null);
  const toppingsGroupRef = useRef<THREE.Group | null>(null);
  const steamParticlesRef = useRef<THREE.Points | null>(null);
  const particleDataRef = useRef<{
    positions: Float32Array;
    velocities: Float32Array;
    opacities: Float32Array;
    phases: Float32Array;
  } | null>(null);

  // Holographic Scan Rings
  const scanRingGroupRef = useRef<THREE.Group | null>(null);

  // Interactive Orbit Physics State
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetRotationRef = useRef<{ x: number; y: number }>({ x: 0.38, y: 0 });
  const currentRotationRef = useRef<{ x: number; y: number }>({ x: 0.38, y: 0 });
  const targetZoomRef = useRef(5.2);
  const currentZoomRef = useRef(5.2);
  const momentumVelocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Raycaster for hover interactions
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseCoordsRef = useRef(new THREE.Vector2(-999, -999));

  // Initialize Three.js WebGL Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 5.2);
    camera.lookAt(0, 0.2, 0);
    cameraRef.current = camera;

    // 3. Renderer with high performance settings
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting Rig (Key, Fill, Rim, and Ambient)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // Warm Key Light with soft shadows
    const keyLight = new THREE.DirectionalLight(0xfff3e0, 2.2);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    // Cold Rim Backlight for specular rim caustics
    const rimLight = new THREE.DirectionalLight(0x88ccff, 1.6);
    rimLight.position.set(-5, 4, -4);
    scene.add(rimLight);

    // Warm Dynamic Broth Point Light (glow from within soup)
    const brothLight = new THREE.PointLight(0xffaa44, 2.0, 4.5);
    brothLight.position.set(0, 0.8, 0);
    scene.add(brothLight);
    brothLightRef.current = brothLight;

    // Ground Caustic Spot
    const underLight = new THREE.PointLight(0x10b981, 1.2, 3);
    underLight.position.set(0, -0.6, 0);
    scene.add(underLight);

    // 5. Build 3D Model Structure
    const foodGroup = new THREE.Group();
    foodGroupRef.current = foodGroup;
    scene.add(foodGroup);

    // A. Ceramic Glazed Ramen Bowl (Procedural Lathe Geometry)
    const bowlPoints: THREE.Vector2[] = [];
    const bowlProfile = [
      [0.0, 0.0],
      [0.9, 0.05],
      [1.0, 0.2],
      [1.4, 0.6],
      [1.85, 1.15],
      [2.05, 1.5],
      [2.1, 1.55],
      [2.0, 1.55],
      [1.75, 1.15],
      [1.3, 0.6],
      [0.85, 0.25],
      [0.0, 0.2],
    ];
    bowlProfile.forEach(([x, y]) => bowlPoints.push(new THREE.Vector2(x, y)));

    const bowlGeo = new THREE.LatheGeometry(bowlPoints, 64);
    const bowlMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a, // Deep indigo slate ceramic
      roughness: 0.12,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.9,
    });
    const bowlMesh = new THREE.Mesh(bowlGeo, bowlMat);
    bowlMesh.castShadow = true;
    bowlMesh.receiveShadow = true;
    foodGroup.add(bowlMesh);

    // Gold Rim Accenting Ring
    const goldRimGeo = new THREE.TorusGeometry(2.05, 0.035, 16, 64);
    goldRimGeo.rotateX(Math.PI / 2);
    goldRimGeo.translate(0, 1.53, 0);
    const goldRimMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.85,
      roughness: 0.2,
    });
    const goldRimMesh = new THREE.Mesh(goldRimGeo, goldRimMat);
    foodGroup.add(goldRimMesh);

    // Bottom Base Ring
    const baseRingGeo = new THREE.CylinderGeometry(0.92, 0.95, 0.15, 32);
    baseRingGeo.translate(0, 0.08, 0);
    const baseRingMesh = new THREE.Mesh(baseRingGeo, bowlMat);
    foodGroup.add(baseRingMesh);

    // B. Translucent Broth Liquid Layer
    const brothGeo = new THREE.CylinderGeometry(1.95, 1.6, 0.2, 48);
    brothGeo.translate(0, 1.25, 0);
    const brothMat = new THREE.MeshPhysicalMaterial({
      color: BROTH_THEMES[broth].liquidColor,
      roughness: 0.12,
      metalness: 0.15,
      transmission: 0.45,
      opacity: 0.95,
      transparent: true,
      ior: 1.333,
      clearcoat: 1.0,
    });
    const brothMesh = new THREE.Mesh(brothGeo, brothMat);
    brothMesh.receiveShadow = true;
    foodGroup.add(brothMesh);
    brothMeshRef.current = brothMesh;

    // Oil Droplet Shimmer Rings on Soup Surface
    const oilGroup = new THREE.Group();
    for (let i = 0; i < 9; i++) {
      const angle = (i / 9) * Math.PI * 2 + Math.random() * 0.3;
      const radius = 0.6 + Math.random() * 0.9;
      const oilSize = 0.12 + Math.random() * 0.15;
      const oilGeo = new THREE.CircleGeometry(oilSize, 16);
      oilGeo.rotateX(-Math.PI / 2);
      const oilMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        metalness: 0.4,
        roughness: 0.1,
        transparent: true,
        opacity: 0.7,
      });
      const oilMesh = new THREE.Mesh(oilGeo, oilMat);
      oilMesh.position.set(Math.cos(angle) * radius, 1.36, Math.sin(angle) * radius);
      oilGroup.add(oilMesh);
    }
    foodGroup.add(oilGroup);

    // C. 3D Ramen Noodles (Curved Splines)
    const noodleMat = new THREE.MeshStandardMaterial({
      color: 0xfde68a, // Golden wheat
      roughness: 0.45,
      metalness: 0.05,
    });

    for (let s = 0; s < 18; s++) {
      const curvePoints: THREE.Vector3[] = [];
      const angleStart = (s / 18) * Math.PI * 2;
      const rad = 0.3 + (s % 3) * 0.45;
      for (let p = 0; p < 7; p++) {
        const theta = angleStart + (p / 7) * 1.8;
        const wave = Math.sin(p * 1.4 + s) * 0.08;
        curvePoints.push(
          new THREE.Vector3(
            Math.cos(theta) * (rad + wave),
            1.2 + Math.sin(p * 0.8) * 0.12,
            Math.sin(theta) * (rad + wave)
          )
        );
      }
      const curve = new THREE.CatmullRomCurve3(curvePoints);
      const noodleGeo = new THREE.TubeGeometry(curve, 24, 0.038, 8, false);
      const noodleMesh = new THREE.Mesh(noodleGeo, noodleMat);
      noodleMesh.castShadow = true;
      foodGroup.add(noodleMesh);
    }

    // D. Toppings Group
    const toppingsGroup = new THREE.Group();
    toppingsGroupRef.current = toppingsGroup;
    foodGroup.add(toppingsGroup);

    // 1. Chashu Pork Belly Slices (Seared texture with fat layer)
    const chashuGroup = new THREE.Group();
    chashuGroup.name = "chashu";
    for (let i = 0; i < 2; i++) {
      const chashuGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.09, 24);
      chashuGeo.scale(1.2, 1, 0.9);
      const chashuMat = new THREE.MeshStandardMaterial({
        color: 0x8b4513,
        roughness: 0.6,
        metalness: 0.1,
      });
      const slice = new THREE.Mesh(chashuGeo, chashuMat);
      slice.position.set(-0.6 + i * 0.35, 1.42 + i * 0.04, -0.4 + i * 0.3);
      slice.rotation.set(0.15, -0.3 + i * 0.4, 0.08);
      slice.castShadow = true;

      // Fat border line
      const fatGeo = new THREE.TorusGeometry(0.53, 0.04, 8, 24);
      fatGeo.rotateX(Math.PI / 2);
      fatGeo.scale(1.2, 1, 0.9);
      const fatMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.3 });
      const fatMesh = new THREE.Mesh(fatGeo, fatMat);
      slice.add(fatMesh);

      chashuGroup.add(slice);
    }
    toppingsGroup.add(chashuGroup);

    // 2. Ajitsuke Tamago (Marinated Soft-boiled Egg Half)
    const tamagoGroup = new THREE.Group();
    tamagoGroup.name = "tamago";
    const eggWhiteGeo = new THREE.SphereGeometry(0.42, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
    eggWhiteGeo.scale(1, 0.7, 1.25);
    eggWhiteGeo.rotateX(Math.PI);
    const eggWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      roughness: 0.2,
      metalness: 0.05,
    });
    const eggWhite = new THREE.Mesh(eggWhiteGeo, eggWhiteMat);
    eggWhite.position.set(0.65, 1.43, -0.3);
    eggWhite.rotation.set(-0.25, 0.4, -0.1);
    eggWhite.castShadow = true;

    // Runny Jammy Yolk Sphere
    const yolkGeo = new THREE.SphereGeometry(0.24, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.5);
    yolkGeo.scale(1, 0.6, 1);
    const yolkMat = new THREE.MeshPhysicalMaterial({
      color: 0xf97316,
      roughness: 0.1,
      metalness: 0.1,
      clearcoat: 0.9,
      transmission: 0.2,
    });
    const yolk = new THREE.Mesh(yolkGeo, yolkMat);
    yolk.position.set(0, 0.02, 0.05);
    eggWhite.add(yolk);
    tamagoGroup.add(eggWhite);
    toppingsGroup.add(tamagoGroup);

    // 3. Crispy Nori Seaweed Sheet
    const noriGroup = new THREE.Group();
    noriGroup.name = "nori";
    const noriGeo = new THREE.BoxGeometry(0.85, 1.2, 0.025);
    noriGeo.translate(0, 0.6, 0);
    const noriMat = new THREE.MeshStandardMaterial({
      color: 0x142318,
      roughness: 0.85,
      metalness: 0.1,
    });
    const noriMesh = new THREE.Mesh(noriGeo, noriMat);
    noriMesh.position.set(-0.2, 1.2, -1.35);
    noriMesh.rotation.set(-0.35, 0.2, 0.05);
    noriMesh.castShadow = true;
    noriGroup.add(noriMesh);
    toppingsGroup.add(noriGroup);

    // 4. Pink Swirl Narutomaki Fish Cake
    const narutoGroup = new THREE.Group();
    narutoGroup.name = "naruto";
    const narutoGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.08, 20);
    const narutoMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const narutoMesh = new THREE.Mesh(narutoGeo, narutoMat);
    narutoMesh.position.set(0.65, 1.38, 0.45);
    narutoMesh.rotation.set(0.2, 0.3, -0.1);
    narutoMesh.castShadow = true;

    // Pink Swirl Accent
    const swirlGeo = new THREE.TorusGeometry(0.14, 0.04, 8, 16, Math.PI * 1.5);
    swirlGeo.rotateX(Math.PI / 2);
    const swirlMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.3 });
    const swirlMesh = new THREE.Mesh(swirlGeo, swirlMat);
    swirlMesh.position.set(0, 0.045, 0);
    narutoMesh.add(swirlMesh);
    narutoGroup.add(narutoMesh);
    toppingsGroup.add(narutoGroup);

    // 5. Fresh Scallions / Green Onions
    const scallionGroup = new THREE.Group();
    scallionGroup.name = "scallions";
    const scallionGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.035, 8);
    const scallionMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.4 });
    for (let i = 0; i < 28; i++) {
      const sc = new THREE.Mesh(scallionGeo, scallionMat);
      const theta = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.7;
      sc.position.set(Math.cos(theta) * r, 1.37 + Math.random() * 0.04, Math.sin(theta) * r);
      sc.rotation.set(Math.random() * 0.4, Math.random() * Math.PI, Math.random() * 0.4);
      scallionGroup.add(sc);
    }
    toppingsGroup.add(scallionGroup);

    // 6. Bamboo Shoots (Menma)
    const menmaGroup = new THREE.Group();
    menmaGroup.name = "menma";
    const menmaGeo = new THREE.BoxGeometry(0.12, 0.04, 0.65);
    const menmaMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 });
    for (let i = 0; i < 3; i++) {
      const menma = new THREE.Mesh(menmaGeo, menmaMat);
      menma.position.set(-0.45 + i * 0.12, 1.39, 0.55 + i * 0.05);
      menma.rotation.set(0.1, -0.4 + i * 0.15, 0.05);
      menma.castShadow = true;
      menmaGroup.add(menma);
    }
    toppingsGroup.add(menmaGroup);

    // 7. Enoki / Shiitake Mushroom bundle
    const mushroomGroup = new THREE.Group();
    mushroomGroup.name = "mushrooms";
    const shroomCapGeo = new THREE.SphereGeometry(0.2, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const shroomMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });
    const cap = new THREE.Mesh(shroomCapGeo, shroomMat);
    cap.position.set(-0.8, 1.45, 0.1);
    cap.rotation.set(0.3, 0.5, -0.2);
    cap.castShadow = true;
    mushroomGroup.add(cap);
    toppingsGroup.add(mushroomGroup);

    // E. 3D Steam Particle Engine (Three.js Points & BufferGeometry)
    const particleCount = 120;
    const pPositions = new Float32Array(particleCount * 3);
    const pVelocities = new Float32Array(particleCount * 3);
    const pOpacities = new Float32Array(particleCount);
    const pPhases = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 1.1;
      pPositions[idx] = Math.cos(angle) * radius;
      pPositions[idx + 1] = 1.35 + Math.random() * 2.2;
      pPositions[idx + 2] = Math.sin(angle) * radius;

      pVelocities[idx] = (Math.random() - 0.5) * 0.012;
      pVelocities[idx + 1] = 0.015 + Math.random() * 0.025; // Upward buoyant rise
      pVelocities[idx + 2] = (Math.random() - 0.5) * 0.012;

      pOpacities[i] = Math.random();
      pPhases[i] = Math.random() * Math.PI * 2;
    }

    const steamGeo = new THREE.BufferGeometry();
    steamGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));

    // Custom Canvas Texture for Soft Blurred Steam Wisps
    const pCanvas = document.createElement("canvas");
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext("2d");
    if (pCtx) {
      const grad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(255, 255, 255, 0.9)");
      grad.addColorStop(0.3, "rgba(255, 255, 255, 0.5)");
      grad.addColorStop(0.7, "rgba(255, 255, 255, 0.15)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 64, 64);
    }
    const pTexture = new THREE.CanvasTexture(pCanvas);

    const steamMat = new THREE.PointsMaterial({
      size: 0.45,
      map: pTexture,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: 0xffeedd,
    });

    const steamPoints = new THREE.Points(steamGeo, steamMat);
    foodGroup.add(steamPoints);
    steamParticlesRef.current = steamPoints;
    particleDataRef.current = {
      positions: pPositions,
      velocities: pVelocities,
      opacities: pOpacities,
      phases: pPhases,
    };

    // F. Holographic AI Biometric Ring Scanner (Quantum nutritional data ring)
    const scanRingGroup = new THREE.Group();
    scanRingGroupRef.current = scanRingGroup;
    const scanRingGeo = new THREE.TorusGeometry(2.35, 0.015, 16, 64);
    scanRingGeo.rotateX(Math.PI / 2);
    const scanRingMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.65,
    });
    const scanRing = new THREE.Mesh(scanRingGeo, scanRingMat);
    scanRing.position.set(0, 1.4, 0);
    scanRingGroup.add(scanRing);

    // Outer Dashed Orbit Ring
    const outerRingGeo = new THREE.TorusGeometry(2.65, 0.012, 16, 64);
    outerRingGeo.rotateX(Math.PI / 2);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.4,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.position.set(0, 1.4, 0);
    scanRingGroup.add(outerRing);

    foodGroup.add(scanRingGroup);

    // Initial positioning
    foodGroup.position.set(0, -0.6, 0);

    // 6. Handle Window / Container Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 7. Render Loop (60 FPS smooth animation)
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // A. Smooth Spring Momentum & Orbit Physics
      if (isAutoRotate && !isDraggingRef.current) {
        targetRotationRef.current.y += 0.006;
      }

      // Add momentum velocity decay
      if (!isDraggingRef.current) {
        targetRotationRef.current.y += momentumVelocityRef.current.y;
        targetRotationRef.current.x += momentumVelocityRef.current.x;
        momentumVelocityRef.current.x *= 0.92;
        momentumVelocityRef.current.y *= 0.92;
      }

      // Clamp vertical tilt so bowl never inverts
      targetRotationRef.current.x = Math.max(0.1, Math.min(1.1, targetRotationRef.current.x));

      // Linear interpolation (Lerp) for buttery smooth camera/mesh rotation
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.08;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.08;
      currentZoomRef.current += (targetZoomRef.current - currentZoomRef.current) * 0.08;

      if (foodGroupRef.current) {
        foodGroupRef.current.rotation.x = currentRotationRef.current.x;
        foodGroupRef.current.rotation.y = currentRotationRef.current.y;
      }

      if (cameraRef.current) {
        cameraRef.current.position.z = currentZoomRef.current;
      }

      // B. Dynamic Holographic Scanner Animation
      if (scanRingGroupRef.current) {
        scanRingGroupRef.current.rotation.y = elapsedTime * 0.8;
        scanRingGroupRef.current.position.y = 1.35 + Math.sin(elapsedTime * 2.5) * 0.18;
      }

      // C. Rising Steam Particle Simulation with Curl Noise
      if (steamParticlesRef.current && particleDataRef.current && isSteamActive) {
        const { positions, velocities, opacities, phases } = particleDataRef.current;
        for (let i = 0; i < particleCount; i++) {
          const idx = i * 3;
          phases[i] += 0.035;

          // Sinusoidal horizontal oscillation
          positions[idx] += Math.sin(phases[i] + positions[idx + 1] * 2.0) * 0.005 + velocities[idx];
          positions[idx + 1] += velocities[idx + 1];
          positions[idx + 2] += Math.cos(phases[i] + positions[idx + 1] * 2.0) * 0.005 + velocities[idx + 2];

          // Reset particle when rising above limit
          if (positions[idx + 1] > 3.8) {
            const angle = Math.random() * Math.PI * 2;
            const r = Math.random() * 0.9;
            positions[idx] = Math.cos(angle) * r;
            positions[idx + 1] = 1.35;
            positions[idx + 2] = Math.sin(angle) * r;
          }
        }
        steamParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // D. Soup Surface Wave Ripple & Shimmer
      if (brothMeshRef.current) {
        brothMeshRef.current.position.y = 1.25 + Math.sin(elapsedTime * 3.0) * 0.006;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  // Update Broth Material & Lighting when prop changes
  useEffect(() => {
    if (!brothMeshRef.current || !brothLightRef.current) return;
    const theme = BROTH_THEMES[broth];
    const mat = brothMeshRef.current.material as THREE.MeshPhysicalMaterial;
    if (mat) {
      mat.color.setHex(theme.liquidColor);
      mat.roughness = theme.roughness;
      mat.metalness = theme.metalness;
      mat.clearcoat = theme.clearcoat;
    }
    brothLightRef.current.color.setHex(theme.lightColor);
    if (steamParticlesRef.current) {
      (steamParticlesRef.current.material as THREE.PointsMaterial).color.setHex(
        theme.particleTint
      );
    }
  }, [broth]);

  // Update Topping Visibility when toppings prop changes
  useEffect(() => {
    if (!toppingsGroupRef.current) return;
    const tg = toppingsGroupRef.current;
    tg.children.forEach((child) => {
      const name = child.name as keyof ToppingConfig;
      if (name in toppings) {
        child.visible = toppings[name];
      }
    });
  }, [toppings]);

  // Update Camera Preset view angles
  useEffect(() => {
    switch (cameraPreset) {
      case "top":
        targetRotationRef.current = { x: 1.15, y: targetRotationRef.current.y };
        targetZoomRef.current = 4.8;
        break;
      case "side":
        targetRotationRef.current = { x: 0.15, y: targetRotationRef.current.y };
        targetZoomRef.current = 5.0;
        break;
      case "closeup":
        targetRotationRef.current = { x: 0.45, y: targetRotationRef.current.y };
        targetZoomRef.current = 3.6;
        break;
      case "perspective":
      default:
        targetRotationRef.current = { x: 0.38, y: targetRotationRef.current.y };
        targetZoomRef.current = 5.2;
        break;
    }
  }, [cameraPreset]);

  // Mouse & Touch Drag-to-Orbit Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    momentumVelocityRef.current = { x: 0, y: 0 };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - prevMousePosRef.current.x;
    const deltaY = e.clientY - prevMousePosRef.current.y;

    const rotSpeed = 0.007;
    targetRotationRef.current.y += deltaX * rotSpeed;
    targetRotationRef.current.x += deltaY * rotSpeed;

    momentumVelocityRef.current = {
      x: deltaY * rotSpeed * 0.4,
      y: deltaX * rotSpeed * 0.4,
    };

    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * 0.003;
    targetZoomRef.current = Math.max(3.2, Math.min(7.5, targetZoomRef.current + zoomDelta));
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      className={`relative w-full h-full cursor-grab active:cursor-grabbing select-none touch-none ${className}`}
    />
  );
};
