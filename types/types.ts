export interface Deposit {
  amount: number;
  date: string;
}

export interface DepositRequirement {
  type: 'total' | 'each' | 'both';
  totalAmount?: number;
  eachAmount?: number;
  count?: number;
}

export interface BonusRequirement {
  deposits: DepositRequirement;
  timeFrame: number; // in days
  holdPeriod?: number; // in days
}

export interface Bonus {
  id: string;
  bankName: string;
  accountType: string;
  amount: number;
  requirements: BonusRequirement;
  startDate: string;
  deposits: Deposit[];
}

