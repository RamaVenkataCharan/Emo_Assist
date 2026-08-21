"use client";

import React, { useRef, useState, MouseEvent } from "react";

interface Card3DProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxRotation?: number; // max tilt angle in degrees
  glowColor?: string;
  enableGlow?: boolean;
}

export default function Card3D({
  children,
  className = "",
  maxRotation = 10,
  glowColor = "rgba(99, 102, 241, 0.18)",
  enableGlow = true,
  ...props
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxRotation;
    const rotateY = ((x - centerX) / centerX) * maxRotation;

    setRotation({ x: rotateX, y: rotateY });
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.6,
    });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`perspective-1000 transition-all duration-200 ${className}`}
      style={{
        transformStyle: "preserve-3d",
      }}
      {...props}
    >
      <div
        className="w-full h-full rounded-3xl relative transition-transform duration-200 ease-out transform-style-3d overflow-hidden"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      >
        {/* Dynamic Specular Light Glare */}
        {enableGlow && (
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl z-10 transition-opacity duration-300"
            style={{
              opacity: glarePosition.opacity,
              background: `radial-gradient(circle 320px at ${glarePosition.x}% ${glarePosition.y}%, ${glowColor}, transparent 70%)`,
            }}
          />
        )}

        {/* Content */}
        <div className="relative z-0 h-full">{children}</div>
      </div>
    </div>
  );
}
