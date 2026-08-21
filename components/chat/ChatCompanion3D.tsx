"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface ChatCompanion3DProps {
  state?: "idle" | "listening" | "thinking";
  size?: number;
  className?: string;
}

export default function ChatCompanion3D({
  state = "idle",
  size = 56,
  className = "",
}: ChatCompanion3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(state);

  const colors = {
    idle: { primary: "#06b6d4", secondary: "#6366f1" },
    listening: { primary: "#10b981", secondary: "#38bdf8" },
    thinking: { primary: "#a855f7", secondary: "#ec4899" },
  };

  const targetPrimary = useRef(new THREE.Color(colors.idle.primary));
  const targetSecondary = useRef(new THREE.Color(colors.idle.secondary));

  useEffect(() => {
    stateRef.current = state;
    const current = colors[state] || colors.idle;
    targetPrimary.current.set(current.primary);
    targetSecondary.current.set(current.secondary);
  }, [state]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
    camera.position.z = 3.8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 2, 10);
    pointLight.position.set(2, 3, 3);
    scene.add(pointLight);

    // Sphere
    const sphereGeo = new THREE.IcosahedronGeometry(1.05, 16);
    const sphereMat = new THREE.MeshPhysicalMaterial({
      color: targetPrimary.current,
      emissive: targetSecondary.current,
      emissiveIntensity: 0.5,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.4,
      transparent: true,
      opacity: 0.95,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);

    // Dynamic Orbital Wave Rings
    const ringGeo = new THREE.TorusGeometry(1.35, 0.025, 12, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: targetPrimary.current,
      transparent: true,
      opacity: 0.4,
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 3;
    scene.add(ring1);
    scene.add(ring2);

    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const currentState = stateRef.current;

      const speedMultiplier = currentState === "thinking" ? 2.5 : currentState === "listening" ? 1.8 : 1.0;

      sphereMat.color.lerp(targetPrimary.current, 0.08);
      sphereMat.emissive.lerp(targetSecondary.current, 0.08);
      ringMat.color.lerp(targetPrimary.current, 0.08);

      sphere.rotation.y = elapsed * 0.8 * speedMultiplier;
      sphere.rotation.x = Math.sin(elapsed * 0.5) * 0.3;

      ring1.rotation.z = elapsed * 1.2 * speedMultiplier;
      ring2.rotation.x = -elapsed * 0.9 * speedMultiplier;

      // Pulse size
      const pulseFreq = currentState === "thinking" ? 5 : currentState === "listening" ? 3 : 1.5;
      const pulseAmp = currentState === "thinking" ? 0.06 : 0.03;
      const s = 1 + Math.sin(elapsed * pulseFreq) * pulseAmp;
      sphere.scale.set(s, s, s);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      sphereGeo.dispose();
      sphereMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, [size]);

  return (
    <div
      ref={containerRef}
      className={`inline-flex items-center justify-center relative ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      title={`AI Companion (${state})`}
    />
  );
}
