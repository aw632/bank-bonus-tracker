"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Bonus } from "../types/types";

interface BonusContextType {
  bonuses: Bonus[];
  setBonuses: React.Dispatch<React.SetStateAction<Bonus[]>>;
}

const BonusContext = createContext<BonusContextType | undefined>(undefined);

export function BonusProvider({ children }: { children: React.ReactNode }) {
  const [bonuses, setBonuses] = useState<Bonus[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const storedBonuses = localStorage.getItem("bankBonuses");
    if (storedBonuses) {
      setBonuses(JSON.parse(storedBonuses));
    }
  }, []);

  // Save to localStorage whenever bonuses change
  useEffect(() => {
    localStorage.setItem("bankBonuses", JSON.stringify(bonuses));
  }, [bonuses]);

  return (
    <BonusContext.Provider value={{ bonuses, setBonuses }}>
      {children}
    </BonusContext.Provider>
  );
}

export function useBonuses() {
  const context = useContext(BonusContext);
  if (context === undefined) {
    throw new Error("useBonuses must be used within a BonusProvider");
  }
  return context;
}
