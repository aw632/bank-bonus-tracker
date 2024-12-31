"use client";

import React, { useState, useEffect } from "react";
import { Bonus } from "../../types/types";
import { getRemainingDays } from "../../utils/bonusUtils";
import BonusCard from "./BonusCard";
import AddBonusForm from "./AddBonusForm";
import { ThemeToggle } from "./ui/theme-toggle";
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
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("recency");

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
            <DropdownMenuContent className="w-48 border-2">
              <DropdownMenuItem
                className={`flex items-center justify-between ${
                  sortBy === "recency" ? "bg-accent" : ""
                }`}
                onClick={() => setSortBy("recency")}
              >
                Recency
                {sortBy === "recency" && <CheckCircle2 className="h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className={`flex items-center justify-between ${
                  sortBy.startsWith("amount") ? "bg-accent" : ""
                }`}
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
                className={`flex items-center justify-between ${
                  sortBy.startsWith("days") ? "bg-accent" : ""
                }`}
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
                className={`flex items-center justify-between ${
                  sortBy.startsWith("alpha") ? "bg-accent" : ""
                }`}
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
          <ThemeToggle />
        </div>
      </div>
      <AddBonusForm onAddBonus={addBonus} />
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
