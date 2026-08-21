"use client";

import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { X, Play, Pause, Volume2, VolumeX, Sparkles, Wind, RefreshCw } from "lucide-react";

export type BreathingTechnique = "box" | "478" | "resonance";

interface TechniqueConfig {
  name: string;
  description: string;
  phases: { name: string; duration: number; action: "inhale" | "hold-in" | "exhale" | "hold-out" }[];
  color: string;
}

const TECHNIQUES: Record<BreathingTechnique, TechniqueConfig> = {
  box: {
    name: "Box Breathing (4-4-4-4)",
    description: "Navy SEAL technique for grounding focus, anxiety relief, and mental clarity.",
    color: "#06b6d4", // Cyan
    phases: [
      { name: "Inhale slowly", duration: 4, action: "inhale" },
      { name: "Hold gently", duration: 4, action: "hold-in" },
      { name: "Exhale smoothly", duration: 4, action: "exhale" },
      { name: "Hold empty", duration: 4, action: "hold-out" },
    ],
  },
  "478": {
    name: "4-7-8 Deep Calm",
    description: "Natural tranquilizer for the nervous system, releasing tension and stress.",
    color: "#818cf8", // Indigo
    phases: [
      { name: "Inhale through nose", duration: 4, action: "inhale" },
      { name: "Hold your breath", duration: 7, action: "hold-in" },
      { name: "Exhale with ease", duration: 8, action: "exhale" },
    ],
  },
  resonance: {
    name: "5-5 Coherent Breathing",
    description: "Optimizes heart-rate variability and cultivates instant serenity.",
    color: "#10b981", // Emerald
    phases: [
      { name: "Inhale smoothly", duration: 5, action: "inhale" },
      { name: "Exhale effortlessly", duration: 5, action: "exhale" },
    ],
  },
};

interface BreathingSpace3DProps {
  isOpen: boolean;
  onClose: () => void;
}

// Gentle Web Audio API Chime Synth
function playTibetanChime(frequency: number = 432, soundOn: boolean = true) {
  if (!soundOn || typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 2.0);
  } catch (e) {
    console.error("Audio chime error:", e);
  }
}

export default function BreathingSpace3D({ isOpen, onClose }: BreathingSpace3DProps) {
  const [technique, setTechnique] = useState<BreathingTechnique>("box");
  const [isActive, setIsActive] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const sphereScaleRef = useRef(1);
  const targetScaleRef = useRef(1);
  const activeColorRef = useRef(new THREE.Color(TECHNIQUES.box.color));

  const currentTechnique = TECHNIQUES[technique];
  const currentPhase = currentTechnique.phases[currentPhaseIndex];

  // Reset counters when switching techniques
  useEffect(() => {
    setCurrentPhaseIndex(0);
    setPhaseSecondsLeft(TECHNIQUES[technique].phases[0].duration);
    activeColorRef.current.set(TECHNIQUES[technique].color);
  }, [technique]);

  // Breathing Timer Engine
  useEffect(() => {
    if (!isOpen || !isActive) return;

    const interval = setInterval(() => {
      setPhaseSecondsLeft((prev) => {
        if (prev <= 1) {
          // Advance to next phase
          const nextIndex = (currentPhaseIndex + 1) % currentTechnique.phases.length;
          if (nextIndex === 0) {
            setCompletedCycles((c) => c + 1);
          }
          setCurrentPhaseIndex(nextIndex);

          // Audio feedback
          const nextPhase = currentTechnique.phases[nextIndex];
          if (nextPhase.action === "inhale") playTibetanChime(528, soundEnabled);
          else if (nextPhase.action === "exhale") playTibetanChime(396, soundEnabled);
          else playTibetanChime(432, soundEnabled);

          return currentTechnique.phases[nextIndex].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isActive, currentPhaseIndex, currentTechnique, soundEnabled]);

  // Update 3D sphere target scale based on phase
  useEffect(() => {
    if (!currentPhase) return;
    if (currentPhase.action === "inhale") {
      targetScaleRef.current = 1.7;
    } else if (currentPhase.action === "hold-in") {
      targetScaleRef.current = 1.7;
    } else if (currentPhase.action === "exhale") {
      targetScaleRef.current = 0.85;
    } else {
      targetScaleRef.current = 0.85;
    }
  }, [currentPhase]);

  // 3D Canvas Scene
  useEffect(() => {
    if (!isOpen) return;
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let width = container.clientWidth || 360;
    let height = container.clientHeight || 360;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 2, 20);
    pointLight.position.set(4, 4, 4);
    scene.add(pointLight);

    // Central Breathing Lotus/Sphere Geometry
    const sphereGeo = new THREE.IcosahedronGeometry(1.2, 24);
    const sphereMat = new THREE.MeshPhysicalMaterial({
      color: activeColorRef.current,
      emissive: activeColorRef.current,
      emissiveIntensity: 0.4,
      roughness: 0.2,
      metalness: 0.1,
      transmission: 0.4,
      transparent: true,
      opacity: 0.9,
      wireframe: false,
    });
    const breathingSphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(breathingSphere);

    // Concentric Ripple Wave Rings
    const rings: THREE.Mesh[] = [];
    for (let r = 0; r < 3; r++) {
      const ringGeo = new THREE.TorusGeometry(1.5 + r * 0.4, 0.018, 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: activeColorRef.current,
        transparent: true,
        opacity: 0.3 - r * 0.08,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.5 + r * 0.2;
      rings.push(ring);
      scene.add(ring);
    }

    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth lerp scale towards target
      sphereScaleRef.current += (targetScaleRef.current - sphereScaleRef.current) * 0.035;
      const s = sphereScaleRef.current;
      breathingSphere.scale.set(s, s, s);

      breathingSphere.rotation.y = elapsed * 0.2;
      breathingSphere.rotation.x = Math.sin(elapsed * 0.15) * 0.2;

      // Pulse color
      sphereMat.color.lerp(activeColorRef.current, 0.05);
      sphereMat.emissive.lerp(activeColorRef.current, 0.05);

      rings.forEach((ring, idx) => {
        ring.rotation.z = elapsed * (0.15 + idx * 0.05);
        const ringScale = s * (1 + idx * 0.15);
        ring.scale.set(ringScale, ringScale, ringScale);
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      sphereGeo.dispose();
      sphereMat.dispose();
      renderer.dispose();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl glass-panel-3d rounded-3xl p-6 sm:p-8 text-center border border-white/20 dark:border-white/10 shadow-2xl overflow-hidden">
        {/* Background Glow */}
        <div
          className="absolute -top-32 -left-32 w-80 h-80 rounded-full blur-3xl opacity-30 pointer-events-none transition-colors duration-1000"
          style={{ backgroundColor: currentTechnique.color }}
        />

        {/* Header Controls */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Wind className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              3D Mindful Breathing Sanctuary
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title={soundEnabled ? "Mute bell chimes" : "Enable bell chimes"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Technique Switcher Tabs */}
        <div className="flex justify-center gap-1.5 p-1 rounded-2xl bg-black/20 backdrop-blur-md mb-4 relative z-10">
          {(Object.keys(TECHNIQUES) as BreathingTechnique[]).map((techKey) => {
            const isSelected = technique === techKey;
            return (
              <button
                key={techKey}
                onClick={() => setTechnique(techKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-white/90 dark:bg-white/20 text-indigo-900 dark:text-white shadow-md backdrop-blur-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {TECHNIQUES[techKey].name.split(" ")[0]}
              </button>
            );
          })}
        </div>

        {/* 3D Breathing Canvas Container */}
        <div className="relative flex items-center justify-center my-2">
          <div ref={containerRef} className="w-72 h-72 sm:w-80 sm:h-80 relative flex items-center justify-center" />

          {/* Central Instruction Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight drop-shadow-md">
              {phaseSecondsLeft}s
            </span>
            <p className="text-sm sm:text-base font-bold text-indigo-600 dark:text-indigo-300 drop-shadow-sm uppercase tracking-wide">
              {currentPhase?.name}
            </p>
          </div>
        </div>

        {/* Technique Description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-5 leading-relaxed relative z-10">
          {currentTechnique.description}
        </p>

        {/* Bottom Bar: Cycles & Play/Pause */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-800/80 relative z-10 text-xs">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            Cycles completed: <strong className="text-slate-800 dark:text-slate-200">{completedCycles}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCurrentPhaseIndex(0);
                setPhaseSecondsLeft(currentTechnique.phases[0].duration);
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors"
              title="Restart session"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsActive(!isActive)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/25 transition-all"
            >
              {isActive ? (
                <>
                  <Pause className="w-4 h-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Resume
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
