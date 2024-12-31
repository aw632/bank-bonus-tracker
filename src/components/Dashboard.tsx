"use client";

import React, { useState, useEffect } from "react";
import { Bonus } from "../../types/types";
import { getRemainingDays } from "../../utils/bonusUtils";
import BonusCard from "./BonusCard";
import AddBonusForm from "./AddBonusForm";
import { Button } from "./ui/button";
import { ChevronDown, CheckCircle2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";

type SortOption =
  | "recency"
  | "amount-asc"
  | "amount-desc"
  | "days-asc"
  | "days-desc"
  | "alpha-asc"
  | "alpha-desc";

export default function Dashboard() {
  const [bonuses, setBonuses] = useState<Bonus[]>(() => {
    if (typeof window !== "undefined") {
      const storedBonuses = localStorage.getItem("bankBonuses");
      return storedBonuses ? JSON.parse(storedBonuses) : [];
    }
    return [];
  });
  const [sortBy, setSortBy] = useState<SortOption>("recency");

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("bankBonuses", JSON.stringify(bonuses));
    }
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
      <div className="relative mb-6">
        <div className="absolute top-0 right-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                Sort by
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem
                className="flex items-center justify-between hover:bg-accent"
                onClick={() => setSortBy("recency")}
              >
                Recency
                {sortBy === "recency" && <CheckCircle2 className="h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center justify-between hover:bg-accent"
                onClick={() =>
                  setSortBy(
                    sortBy === "amount-asc" ? "amount-desc" : "amount-asc"
                  )
                }
              >
                <span>Amount</span>
                {sortBy.startsWith("amount") && (
                  <span className="text-muted-foreground">
                    {sortBy.endsWith("asc") ? "↑" : "↓"}
                  </span>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center justify-between hover:bg-accent"
                onClick={() =>
                  setSortBy(sortBy === "days-asc" ? "days-desc" : "days-asc")
                }
              >
                <span>Days Left</span>
                {sortBy.startsWith("days") && (
                  <span className="text-muted-foreground">
                    {sortBy.endsWith("asc") ? "↑" : "↓"}
                  </span>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center justify-between hover:bg-accent"
                onClick={() =>
                  setSortBy(sortBy === "alpha-asc" ? "alpha-desc" : "alpha-asc")
                }
              >
                <span>Alphabetical</span>
                {sortBy.startsWith("alpha") && (
                  <span className="text-muted-foreground">
                    {sortBy.endsWith("asc") ? "↑" : "↓"}
                  </span>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <AddBonusForm onAddBonus={addBonus} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {[...bonuses]
          .sort((a, b) => {
            switch (sortBy) {
              case "recency":
                return (
                  new Date(b.startDate).getTime() -
                  new Date(a.startDate).getTime()
                );
              case "amount-asc":
                return a.amount - b.amount;
              case "amount-desc":
                return b.amount - a.amount;
              case "days-asc":
                return getRemainingDays(a) - getRemainingDays(b);
              case "days-desc":
                return getRemainingDays(b) - getRemainingDays(a);
              case "alpha-asc":
                return a.bankName.localeCompare(b.bankName);
              case "alpha-desc":
                return b.bankName.localeCompare(a.bankName);
              default:
                return 0;
            }
          })
          .map((bonus) => (
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
