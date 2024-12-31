"use client";

import React, { useState, useEffect } from "react";
import { Bonus } from "../../types/types";
import { getRemainingDays } from "../../utils/bonusUtils";
import BonusCard from "./BonusCard";
import AddBonusForm from "./AddBonusForm";
import { ThemeToggle } from "./ui/theme-toggle";
import { Button } from "./ui/button";
import { ArrowUpDown } from "lucide-react";

type SortOption = 'amount-asc' | 'amount-desc' | 'days-asc' | 'days-desc';

export default function Dashboard() {
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('amount-desc');

  useEffect(() => {
    const storedBonuses = localStorage.getItem("bankBonuses");
    if (storedBonuses) {
      setBonuses(JSON.parse(storedBonuses));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bankBonuses", JSON.stringify(bonuses));
  }, [bonuses]);

  const addBonus = (newBonus: Bonus) => {
    setBonuses([...bonuses, newBonus]);
  };

  const updateBonus = (updatedBonus: Bonus) => {
    setBonuses(
      bonuses.map((bonus) =>
        bonus.id === updatedBonus.id ? updatedBonus : bonus
      )
    );
  };

  const deleteBonus = (id: string) => {
    setBonuses(bonuses.filter((bonus) => bonus.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Bank Bonus Tracker</h1>
        <div className="flex gap-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortBy(sortBy === 'amount-asc' ? 'amount-desc' : 'amount-asc')}
              className="flex items-center gap-1"
            >
              Amount
              <ArrowUpDown className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortBy(sortBy === 'days-asc' ? 'days-desc' : 'days-asc')}
              className="flex items-center gap-1"
            >
              Days Left
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
          <ThemeToggle />
        </div>
      </div>
      <AddBonusForm onAddBonus={addBonus} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {[...bonuses].sort((a, b) => {
          if (sortBy === 'amount-asc') return a.amount - b.amount;
          if (sortBy === 'amount-desc') return b.amount - a.amount;
          if (sortBy === 'days-asc') return getRemainingDays(a) - getRemainingDays(b);
          return getRemainingDays(b) - getRemainingDays(a);
        }).map((bonus) => (
          <BonusCard
            key={bonus.id}
            bonus={bonus}
            onUpdate={updateBonus}
            onDelete={deleteBonus}
          />
        ))}
      </div>
    </div>
  );
}
