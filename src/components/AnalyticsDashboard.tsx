"use client";

import { useBonuses } from "@/context/BonusContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { isCompleted } from "../utils/bonusUtils";
import { Pie, PieChart, Label } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";

export default function AnalyticsDashboard() {
  const { bonuses } = useBonuses();

  // Calculate analytics data
  const totalBonuses = bonuses.length;
  const totalAmount = bonuses
    .filter((bonus) => isCompleted(bonus))
    .reduce((sum, bonus) => sum + bonus.amount, 0);
  const totalDeposits = bonuses.reduce((sum, bonus) => {
    return (
      sum +
      bonus.deposits.reduce(
        (depositSum, deposit) => depositSum + deposit.amount,
        0
      )
    );
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
        <Card className="col-span-2 md:col-span-1">
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
            <div className="text-2xl font-bold">
              ${totalAmount.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Earned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Deposits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalDeposits.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Deposited</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Bonus Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-[300px]">
            <ChartContainer
              config={{
                Completed: { color: "hsl(var(--chart-1))" },
                "In Progress": { color: "hsl(var(--chart-2))" },
                "Not Started": { color: "hsl(var(--chart-3))" },
              }}
              className="w-full h-full"
            >
              <PieChart
                width={300}
                height={300}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              >
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={[
                    {
                      name: "Completed",
                      value: bonuses.filter((bonus) => isCompleted(bonus))
                        .length,
                      fill: "hsl(var(--chart-1))",
                    },
                    {
                      name: "In Progress",
                      value: bonuses.filter(
                        (bonus) =>
                          !isCompleted(bonus) && bonus.deposits.length > 0
                      ).length,
                      fill: "hsl(var(--chart-2))",
                    },
                    {
                      name: "Not Started",
                      value: bonuses.filter(
                        (bonus) => bonus.deposits.length === 0
                      ).length,
                      fill: "hsl(var(--chart-3))",
                    },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={0}
                  stroke="hsl(var(--background))"
                  strokeWidth={3}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {bonuses.length.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Bonuses
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
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
                    value={(() => {
                      const { type, totalAmount, eachAmount, count } =
                        bonus.requirements.deposits;
                      const totalDeposited = bonus.deposits.reduce(
                        (sum, deposit) => sum + deposit.amount,
                        0
                      );

                      if (type === "total") {
                        return totalAmount
                          ? (totalDeposited / totalAmount) * 100
                          : 0;
                      } else if (type === "each") {
                        return count
                          ? (bonus.deposits.length / count) * 100
                          : 0;
                      } else if (type === "both") {
                        const totalRequired =
                          (totalAmount || 0) + (eachAmount || 0) * (count || 0);
                        return totalRequired
                          ? (totalDeposited / totalRequired) * 100
                          : 0;
                      }
                      return 0;
                    })()}
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
