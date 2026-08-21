"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export type EmotionMood = "Calm" | "Joyful" | "Grateful" | "Hopeful" | "Neutral" | "Anxious" | "Overwhelmed" | "Low" | "Exhausted" | "Irritable";

interface EmotionSphere3DProps {
  mood?: EmotionMood | string;
  intensity?: number; // 1 - 10
  interactive?: boolean;
  className?: string;
  size?: number;
}

const MOOD_COLOR_CONFIG: Record<string, { primary: string; secondary: string; accent: string; speed: number; roughness: number }> = {
  Calm: { primary: "#06b6d4", secondary: "#10b981", accent: "#6366f1", speed: 0.6, roughness: 0.25 },
  Joyful: { primary: "#fbbf24", secondary: "#f59e0b", accent: "#10b981", speed: 1.3, roughness: 0.4 },
  Grateful: { primary: "#10b981", secondary: "#059669", accent: "#06b6d4", speed: 0.8, roughness: 0.3 },
  Hopeful: { primary: "#38bdf8", secondary: "#818cf8", accent: "#34d399", speed: 1.0, roughness: 0.35 },
  Neutral: { primary: "#64748b", secondary: "#94a3b8", accent: "#6366f1", speed: 0.7, roughness: 0.2 },
  Anxious: { primary: "#f59e0b", secondary: "#ef4444", accent: "#8b5cf6", speed: 2.2, roughness: 0.65 },
  Overwhelmed: { primary: "#f43f5e", secondary: "#e11d48", accent: "#7c3aed", speed: 2.5, roughness: 0.75 },
  Low: { primary: "#4f46e5", secondary: "#3b82f6", accent: "#1e1b4b", speed: 0.5, roughness: 0.15 },
  Exhausted: { primary: "#7c3aed", secondary: "#6366f1", accent: "#312e81", speed: 0.4, roughness: 0.2 },
  Irritable: { primary: "#ea580c", secondary: "#f97316", accent: "#b91c1c", speed: 1.8, roughness: 0.55 },
};

// Simple 3D Perlin/Simplex noise approximation for vertex animation
function noise3D(x: number, y: number, z: number): number {
  return (
    Math.sin(x * 1.5 + y * 2.1) * 0.4 +
    Math.cos(y * 1.8 + z * 1.4) * 0.35 +
    Math.sin(z * 2.2 + x * 1.1) * 0.25
  );
}

export default function EmotionSphere3D({
  mood = "Calm",
  intensity = 6,
  interactive = true,
  className = "",
}: EmotionSphere3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const config = MOOD_COLOR_CONFIG[mood] || MOOD_COLOR_CONFIG.Calm;

  const targetColorsRef = useRef({
    primary: new THREE.Color(config.primary),
    secondary: new THREE.Color(config.secondary),
    accent: new THREE.Color(config.accent),
  });

  const moodConfigRef = useRef(config);
  const intensityRef = useRef(intensity);

  useEffect(() => {
    const currentConfig = MOOD_COLOR_CONFIG[mood] || MOOD_COLOR_CONFIG.Calm;
    moodConfigRef.current = currentConfig;
    targetColorsRef.current.primary.set(currentConfig.primary);
    targetColorsRef.current.secondary.set(currentConfig.secondary);
    targetColorsRef.current.accent.set(currentConfig.accent);
  }, [mood]);

  useEffect(() => {
    intensityRef.current = intensity;
  }, [intensity]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let width = container.clientWidth || 400;
    let height = container.clientHeight || 400;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 5.2;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(config.primary, 3, 20);
    pointLight1.position.set(4, 4, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(config.secondary, 2.5, 20);
    pointLight2.position.set(-4, -3, 3);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(config.accent, 2, 20);
    pointLight3.position.set(0, -4, -2);
    scene.add(pointLight3);

    // Geometry - High detail Icosahedron
    const radius = 1.45;
    const originalGeometry = new THREE.IcosahedronGeometry(radius, 40);
    const geometry = originalGeometry.clone();
    const positionAttribute = geometry.getAttribute("position");
    const originalPositions = originalGeometry.getAttribute("position").array.slice();

    // Custom Shader / Physical material
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(config.primary),
      emissive: new THREE.Color(config.secondary),
      emissiveIntensity: 0.35,
      roughness: config.roughness,
      metalness: 0.1,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
      transmission: 0.3,
      opacity: 0.95,
      transparent: true,
      wireframe: false,
    });

    const sphereMesh = new THREE.Mesh(geometry, material);
    scene.add(sphereMesh);

    // Outer Glow Ring / Aura Halo Particles
    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const dist = radius * (1.2 + Math.random() * 0.7);

      particlePositions[i * 3] = dist * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = dist * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = dist * Math.cos(phi);
      particleScales[i] = Math.random() * 0.04 + 0.015;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(config.accent),
      size: 0.05,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // Mouse Tracking for Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 1.5;
      targetY = y * 1.5;
    };

    window.addEventListener("mousemove", handlePointerMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Clock
    const clock = new THREE.Clock();

    // Render loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();
      const cfg = moodConfigRef.current;
      const intMult = (intensityRef.current / 5); // 0.2 to 2.0
      const currentSpeed = cfg.speed * (0.6 + intMult * 0.4);

      // Smooth color transitions
      material.color.lerp(targetColorsRef.current.primary, 0.05);
      material.emissive.lerp(targetColorsRef.current.secondary, 0.05);
      pointLight1.color.lerp(targetColorsRef.current.primary, 0.05);
      pointLight2.color.lerp(targetColorsRef.current.secondary, 0.05);
      pointLight3.color.lerp(targetColorsRef.current.accent, 0.05);
      particleMaterial.color.lerp(targetColorsRef.current.accent, 0.05);

      // Smooth mouse rotation
      mouseX += (targetX - mouseX) * 0.06;
      mouseY += (targetY - mouseY) * 0.06;

      sphereMesh.rotation.y = elapsedTime * 0.25 * currentSpeed + mouseX;
      sphereMesh.rotation.x = Math.sin(elapsedTime * 0.15) * 0.2 + mouseY;

      particleSystem.rotation.y = -elapsedTime * 0.15 * currentSpeed + mouseX * 0.5;
      particleSystem.rotation.x = elapsedTime * 0.1 + mouseY * 0.5;

      // Vertex displacement wave animation
      const posArr = positionAttribute.array as Float32Array;
      const origArr = originalPositions;
      const waveFreq = 1.2 * intMult;
      const waveAmp = (0.12 + (cfg.roughness * 0.18)) * (0.5 + intMult * 0.5);

      for (let i = 0; i < posArr.length; i += 3) {
        const ox = origArr[i];
        const oy = origArr[i + 1];
        const oz = origArr[i + 2];

        // Normalize vector
        const len = Math.sqrt(ox * ox + oy * oy + oz * oz);
        const nx = ox / len;
        const ny = oy / len;
        const nz = oz / len;

        const noise = noise3D(
          nx * waveFreq + elapsedTime * currentSpeed,
          ny * waveFreq + elapsedTime * currentSpeed * 0.8,
          nz * waveFreq
        );

        // Breathing pulse
        const breath = Math.sin(elapsedTime * 1.2) * 0.04;
        const displacement = 1 + (noise * waveAmp) + breath;

        posArr[i] = ox * displacement;
        posArr[i + 1] = oy * displacement;
        posArr[i + 2] = oz * displacement;
      }

      positionAttribute.needsUpdate = true;
      geometry.computeVertexNormals();

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center cursor-grab active:cursor-grabbing ${className}`}
      style={{ minHeight: "320px", width: "100%" }}
    />
  );
}
