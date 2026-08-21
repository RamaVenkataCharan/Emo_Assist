"use client";

import React, { createContext, useContext, useState } from "react";
import BreathingSpace3D from "./BreathingSpace3D";

interface BreathingContextType {
  openBreathing: () => void;
  closeBreathing: () => void;
  isOpen: boolean;
}

const BreathingContext = createContext<BreathingContextType>({
  openBreathing: () => {},
  closeBreathing: () => {},
  isOpen: false,
});

export const useBreathingSpace = () => useContext(BreathingContext);

export function BreathingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openBreathing = () => setIsOpen(true);
  const closeBreathing = () => setIsOpen(false);

  return (
    <BreathingContext.Provider value={{ openBreathing, closeBreathing, isOpen }}>
      {children}
      <BreathingSpace3D isOpen={isOpen} onClose={closeBreathing} />
    </BreathingContext.Provider>
  );
}
