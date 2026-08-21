"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { EmotionMood } from "./EmotionSphere3D";

interface MoodCrystal3DProps {
  mood: EmotionMood | string;
  intensity: number; // 1 to 10
  size?: number;
  className?: string;
}

const CRYSTAL_PALETTES: Record<string, { color: string; emissive: string }> = {
  Calm: { color: "#38bdf8", emissive: "#0284c7" },
  Joyful: { color: "#34d399", emissive: "#059669" },
  Grateful: { color: "#2dd4bf", emissive: "#0d9488" },
  Hopeful: { color: "#22d3ee", emissive: "#0891b2" },
  Neutral: { color: "#94a3b8", emissive: "#475569" },
  Anxious: { color: "#fbbf24", emissive: "#d97706" },
  Overwhelmed: { color: "#f87171", emissive: "#dc2626" },
  Low: { color: "#818cf8", emissive: "#4f46e5" },
  Exhausted: { color: "#c084fc", emissive: "#9333ea" },
  Irritable: { color: "#fb923c", emissive: "#ea580c" },
};

export default function MoodCrystal3D({
  mood = "Calm",
  intensity = 6,
  size = 140,
  className = "",
}: MoodCrystal3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const palette = CRYSTAL_PALETTES[mood] || CRYSTAL_PALETTES.Calm;

  const targetColor = useRef(new THREE.Color(palette.color));
  const targetEmissive = useRef(new THREE.Color(palette.emissive));
  const intensityRef = useRef(intensity);

  useEffect(() => {
    const pal = CRYSTAL_PALETTES[mood] || CRYSTAL_PALETTES.Calm;
    targetColor.current.set(pal.color);
    targetEmissive.current.set(pal.emissive);
  }, [mood]);

  useEffect(() => {
    intensityRef.current = intensity;
  }, [intensity]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
    camera.position.z = 3.6;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const light1 = new THREE.PointLight(0xffffff, 2.5, 10);
    light1.position.set(3, 3, 3);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xffffff, 1.5, 10);
    light2.position.set(-3, -2, 2);
    scene.add(light2);

    // Crystal Geometry
    const crystalGeo = new THREE.OctahedronGeometry(1.15, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(palette.color),
      emissive: new THREE.Color(palette.emissive),
      emissiveIntensity: 0.4,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.5,
      thickness: 1.2,
      ior: 1.6,
      transparent: true,
      opacity: 0.92,
      flatShading: true,
    });

    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    scene.add(crystal);

    // Wireframe Cage for Holographic 3D Facet Sheen
    const wireGeo = new THREE.OctahedronGeometry(1.17, 0);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireMesh);

    // Subtle Particle Ring
    const ringGeo = new THREE.TorusGeometry(1.6, 0.02, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(palette.color),
      transparent: true,
      opacity: 0.35,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    scene.add(ringMesh);

    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const intMult = intensityRef.current / 5;

      // Color lerp
      crystalMat.color.lerp(targetColor.current, 0.08);
      crystalMat.emissive.lerp(targetEmissive.current, 0.08);
      ringMat.color.lerp(targetColor.current, 0.08);

      // Rotation speed based on intensity
      const rotSpeed = 0.8 * intMult;
      crystal.rotation.y = elapsed * 0.6 * rotSpeed;
      crystal.rotation.x = Math.sin(elapsed * 0.5 * rotSpeed) * 0.4;
      crystal.rotation.z = Math.cos(elapsed * 0.3 * rotSpeed) * 0.2;

      wireMesh.rotation.copy(crystal.rotation);

      ringMesh.rotation.z = elapsed * 0.4 * rotSpeed;

      // Subtle scale pulse
      const pulse = 1 + Math.sin(elapsed * 2 * intMult) * (0.03 * intMult);
      crystal.scale.set(pulse, pulse, pulse);
      wireMesh.scale.set(pulse, pulse, pulse);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      crystalGeo.dispose();
      crystalMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, [size]);

  return (
    <div
      ref={containerRef}
      className={`inline-flex items-center justify-center relative cursor-pointer ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      title={`Live 3D Mood Crystal (${mood}, Intensity: ${intensity}/10)`}
    />
  );
}
