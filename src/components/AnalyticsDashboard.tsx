"use client";

import { useBonuses } from "@/context/BonusContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";

export default function AnalyticsDashboard() {
  const { bonuses } = useBonuses();

  // Calculate analytics data
  const totalBonuses = bonuses.length;
  const totalAmount = bonuses.reduce((sum, bonus) => sum + bonus.amount, 0);
  const totalDeposits = bonuses.reduce((sum, bonus) => {
    const { type, totalAmount, eachAmount, count } = bonus.requirements.deposits;
    
    if (type === 'total') {
      return sum + (totalAmount || 0);
    } else if (type === 'each') {
      return sum + ((eachAmount || 0) * (count || 0));
    } else if (type === 'both') {
      return sum + (totalAmount || 0) + ((eachAmount || 0) * (count || 0));
    }
    return sum;
  }, 0);

  // Calculate annualized return rate (simplified example)
  const averageBonus = totalBonuses > 0 ? totalAmount / totalBonuses : 0;
  const averageDeposit = totalBonuses > 0 ? totalDeposits / totalBonuses : 0;
  const annualizedReturn =
    averageDeposit > 0 ? ((averageBonus / averageDeposit) * 100).toFixed(2) : 0;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Bonuses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBonuses}</div>
            <p className="text-sm text-muted-foreground">This year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Bonus Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Earned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Deposits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDeposits.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Required</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Annualized Return</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{annualizedReturn}%</div>
            <p className="text-sm text-muted-foreground">Average</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Bonus Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bonuses.map((bonus) => (
                <div key={bonus.id} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{bonus.bankName}</span>
                    <Badge variant="outline">
                      ${bonus.amount.toLocaleString()}
                    </Badge>
                  </div>
                  <Progress
                    value={(bonus.deposits.length / 3) * 100} // Example progress calculation
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
