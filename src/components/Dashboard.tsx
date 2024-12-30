import React, { useState, useEffect } from 'react';
import { Bonus } from '../types/types';
import BonusCard from './BonusCard';
import AddBonusForm from './AddBonusForm';
import { calculateProgress, getRemainingDays, isCompleted } from '../utils/bonusUtils';

export default function Dashboard() {
  const [bonuses, setBonuses] = useState<Bonus[]>([]);

  useEffect(() => {
    const storedBonuses = localStorage.getItem('bankBonuses');
    if (storedBonuses) {
      setBonuses(JSON.parse(storedBonuses));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bankBonuses', JSON.stringify(bonuses));
  }, [bonuses]);

  const addBonus = (newBonus: Bonus) => {
    setBonuses([...bonuses, newBonus]);
  };

  const updateBonus = (updatedBonus: Bonus) => {
    setBonuses(bonuses.map(bonus => bonus.id === updatedBonus.id ? updatedBonus : bonus));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Bank Bonus Tracker</h1>
      <AddBonusForm onAddBonus={addBonus} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {bonuses.map(bonus => (
          <BonusCard key={bonus.id} bonus={bonus} onUpdate={updateBonus} />
        ))}
      </div>
    </div>
  );
}

