import { Bonus, Deposit, DepositRequirement } from "../types/types";

export function calculateProgress(bonus: Bonus): number {
  const { deposits, requirements } = bonus;
  const { deposits: depositReq } = requirements;

  const totalDeposited = deposits.reduce(
    (sum, deposit) => sum + deposit.amount,
    0
  );
  const depositCount = deposits.length;

  switch (depositReq.type) {
    case "total":
      return Math.min(totalDeposited / (depositReq.totalAmount || 1), 1);
    case "each":
      return Math.min(depositCount / (depositReq.count || 1), 1);
    case "both":
      const totalProgress = totalDeposited / (depositReq.totalAmount || 1);
      const countProgress = depositCount / (depositReq.count || 1);
      const eachProgress = deposits.every(
        (d) => d.amount >= (depositReq.eachAmount || 0)
      )
        ? 1
        : 0;
      return Math.min(totalProgress, countProgress, eachProgress);
  }
}

export function isCompleted(bonus: Bonus): boolean {
  return calculateProgress(bonus) === 1;
}

export function getRemainingDays(bonus: Bonus): number {
  const startDate = new Date(bonus.startDate);
  const endDate = new Date(
    startDate.getTime() + bonus.requirements.timeFrame * 24 * 60 * 60 * 1000
  );
  const today = new Date();
  const remainingDays = Math.ceil(
    (endDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)
  );
  return Math.max(remainingDays, 0);
}

export function canWithdraw(bonus: Bonus): boolean {
  if (!bonus.requirements.holdPeriod) return true;

  const startDate = new Date(bonus.startDate);
  const holdEndDate = new Date(
    startDate.getTime() + bonus.requirements.holdPeriod * 24 * 60 * 60 * 1000
  );
  return new Date() >= holdEndDate;
}

export function calculateRemainingAmount(bonus: Bonus): number {
  const { deposits, requirements } = bonus;
  const { deposits: depositReq } = requirements;

  const totalDeposited = deposits.reduce(
    (sum, deposit) => sum + deposit.amount,
    0
  );

  switch (depositReq.type) {
    case "total":
      return Math.max((depositReq.totalAmount || 0) - totalDeposited, 0);
    case "each":
      const remainingDeposits = Math.max(
        (depositReq.count || 0) - deposits.length,
        0
      );
      return remainingDeposits * (depositReq.eachAmount || 0);
    case "both":
      const remainingTotal = Math.max(
        (depositReq.totalAmount || 0) - totalDeposited,
        0
      );
      const remainingEach =
        Math.max((depositReq.count || 0) - deposits.length, 0) *
        (depositReq.eachAmount || 0);
      return Math.max(remainingTotal, remainingEach);
  }
}
