import React from "react";
import { Bonus } from "../../types/types";
import {
  calculateProgress,
  getRemainingDays,
  isCompleted,
  canWithdraw,
  calculateRemainingAmount,
} from "../../utils/bonusUtils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CalendarDays,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Trash2,
} from "lucide-react";

interface BonusCardProps {
  bonus: Bonus;
  onUpdate: (updatedBonus: Bonus) => void;
  onDelete: (id: string) => void;
}

export default function BonusCard({
  bonus,
  onUpdate,
  onDelete,
}: BonusCardProps) {
  const progress = calculateProgress(bonus);
  const remainingDays = getRemainingDays(bonus);
  const completed = isCompleted(bonus);
  const withdrawable = canWithdraw(bonus);
  const remainingAmount = calculateRemainingAmount(bonus);

  const addDeposit = () => {
    const amount = parseFloat(prompt("Enter deposit amount:") || "0");
    if (amount > 0) {
      const updatedBonus = {
        ...bonus,
        deposits: [
          ...bonus.deposits,
          { amount, date: new Date().toISOString() },
        ],
      };
      onUpdate(updatedBonus);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span>{bonus.bankName}</span>
            <Badge
              variant={
                bonus.accountType === "Checking"
                  ? "default"
                  : bonus.accountType === "Savings"
                  ? "secondary"
                  : "outline"
              }
            >
              {bonus.accountType}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(bonus.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-green-600">
            ${bonus.amount}
          </span>
          <Badge variant={completed ? "secondary" : "default"}>
            {completed ? "Completed" : "In Progress"}
          </Badge>{" "}
        </div>
        <Progress value={progress * 100} className="w-full" />
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              ${remainingAmount.toFixed(2)} remaining
            </span>
          </div>
          <div className="flex items-center">
            <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{remainingDays} days left</span>
          </div>
        </div>
        <div className="flex items-center">
          {withdrawable ? (
            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="mr-2 h-4 w-4 text-yellow-500" />
          )}
          <span className="text-sm">
            {withdrawable ? "Can withdraw" : "Cannot withdraw yet"}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={addDeposit} className="w-full" disabled={completed}>
          Add Deposit
        </Button>
      </CardFooter>
    </Card>
  );
}
