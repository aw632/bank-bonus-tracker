import { Bonus } from "../../src/types/types";
import {
  calculateProgress,
  isCompleted,
  getRemainingDays,
  canWithdraw,
  calculateRemainingAmount,
} from "../../src/utils/bonusUtils";

describe("bonusUtils", () => {
  const mockDate = new Date("2024-01-01");

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe("calculateProgress", () => {
    it("should calculate progress for total deposit requirement", () => {
      const bonus: Bonus = {
        id: "1",
        bankName: "Test Bank",
        accountType: "Checking",
        amount: 200,
        requirements: {
          deposits: {
            type: "total",
            totalAmount: 1000,
          },
          timeFrame: 90,
        },
        startDate: "2024-01-01",
        deposits: [{ amount: 500, date: "2024-01-01" }],
      };

      expect(calculateProgress(bonus)).toBe(0.5);
    });

    it("should calculate progress for each deposit requirement", () => {
      const bonus: Bonus = {
        id: "1",
        bankName: "Test Bank",
        accountType: "Checking",
        amount: 200,
        requirements: {
          deposits: {
            type: "each",
            eachAmount: 100,
            count: 5,
          },
          timeFrame: 90,
        },
        startDate: "2024-01-01",
        deposits: [
          { amount: 100, date: "2024-01-01" },
          { amount: 100, date: "2024-01-02" },
        ],
      };

      expect(calculateProgress(bonus)).toBe(0.4);
    });

    it("should calculate progress for both total and each deposit requirements", () => {
      const bonus: Bonus = {
        id: "1",
        bankName: "Test Bank",
        accountType: "Checking",
        amount: 200,
        requirements: {
          deposits: {
            type: "both",
            totalAmount: 1000,
            eachAmount: 100,
            count: 10,
          },
          timeFrame: 90,
        },
        startDate: "2024-01-01",
        deposits: [
          { amount: 100, date: "2024-01-01" },
          { amount: 100, date: "2024-01-02" },
          { amount: 100, date: "2024-01-03" },
        ],
      };

      expect(calculateProgress(bonus)).toBe(0.3);
    });

    it("should return 1 when progress exceeds 100%", () => {
      const bonus: Bonus = {
        id: "1",
        bankName: "Test Bank",
        accountType: "Checking",
        amount: 200,
        requirements: {
          deposits: {
            type: "total",
            totalAmount: 1000,
          },
          timeFrame: 90,
        },
        startDate: "2024-01-01",
        deposits: [{ amount: 1500, date: "2024-01-01" }],
      };

      expect(calculateProgress(bonus)).toBe(1);
    });
  });

  describe("isCompleted", () => {
    it("should return true when progress is 100%", () => {
      const bonus: Bonus = {
        id: "1",
        bankName: "Test Bank",
        accountType: "Checking",
        amount: 200,
        requirements: {
          deposits: {
            type: "total",
            totalAmount: 1000,
          },
          timeFrame: 90,
        },
        startDate: "2024-01-01",
        deposits: [{ amount: 1000, date: "2024-01-01" }],
      };

      expect(isCompleted(bonus)).toBe(true);
    });

    it("should return false when progress is less than 100%", () => {
      const bonus: Bonus = {
        id: "1",
        bankName: "Test Bank",
        accountType: "Checking",
        amount: 200,
        requirements: {
          deposits: {
            type: "total",
            totalAmount: 1000,
          },
          timeFrame: 90,
        },
        startDate: "2024-01-01",
        deposits: [{ amount: 500, date: "2024-01-01" }],
      };

      expect(isCompleted(bonus)).toBe(false);
    });
  });

  describe("getRemainingDays", () => {
    it("should calculate remaining days correctly", () => {
      const bonus: Bonus = {
        id: "1",
        bankName: "Test Bank",
        accountType: "Checking",
        amount: 200,
        requirements: {
          deposits: {
            type: "total",
            totalAmount: 1000,
          },
          timeFrame: 90,
        },
        startDate: "2024-01-01",
        deposits: [],
      };

      // Mock date is 2024-01-01
      expect(getRemainingDays(bonus)).toBe(90);
    });

    it("should return 0 when time frame has passed", () => {
      const bonus: Bonus = {
        id: "1",
        bankName: "Test Bank",
        accountType: "Checking",
        amount: 200,
        requirements: {
          deposits: {
            type: "total",
            totalAmount: 1000,
          },
          timeFrame: 90,
        },
        startDate: "2023-10-01", // More than 90 days ago
        deposits: [],
      };

      expect(getRemainingDays(bonus)).toBe(0);
    });
  });

  describe("canWithdraw", () => {
    it("should return true when there is no hold period", () => {
      const bonus: Bonus = {
        id: "1",
        bankName: "Test Bank",
        accountType: "Checking",
        amount: 200,
        requirements: {
          deposits: {
            type: "total",
            totalAmount: 1000,
          },
          timeFrame: 90,
        },
        startDate: "2024-01-01",
        deposits: [],
      };

      expect(canWithdraw(bonus)).toBe(true);
    });

    it("should return false when hold period has not passed", () => {
      const bonus: Bonus = {
        id: "1",
        bankName: "Test Bank",
        accountType: "Checking",
        amount: 200,
        requirements: {
          deposits: {
            type: "total",
            totalAmount: 1000,
          },
          timeFrame: 90,
          holdPeriod: 60,
        },
        startDate: "2024-01-01",
        deposits: [],
      };

      // Mock date is 2024-01-01
      expect(canWithdraw(bonus)).toBe(false);
    });

    it("should return true when hold period has passed", () => {
      const bonus: Bonus = {
        id: "1",
        bankName: "Test Bank",
        accountType: "Checking",
        amount: 200,
        requirements: {
          deposits: {
            type: "total",
            totalAmount: 1000,
          },
          timeFrame: 90,
          holdPeriod: 60,
        },
        startDate: "2023-11-01", // More than 60 days ago
        deposits: [],
      };

      expect(canWithdraw(bonus)).toBe(true);
    });
  });

  describe("calculateRemainingAmount", () => {
    it("should calculate remaining amount for total deposit requirement", () => {
      const bonus: Bonus = {
        id: "1",
        bankName: "Test Bank",
        accountType: "Checking",
        amount: 200,
        requirements: {
          deposits: {
            type: "total",
            totalAmount: 1000,
          },
          timeFrame: 90,
        },
        startDate: "2024-01-01",
        deposits: [{ amount: 500, date: "2024-01-01" }],
      };

      expect(calculateRemainingAmount(bonus)).toBe(500);
    });

    it("should calculate remaining amount for each deposit requirement", () => {
      const bonus: Bonus = {
        id: "1",
        bankName: "Test Bank",
        accountType: "Checking",
        amount: 200,
        requirements: {
          deposits: {
            type: "each",
            eachAmount: 100,
            count: 5,
          },
          timeFrame: 90,
        },
        startDate: "2024-01-01",
        deposits: [
          { amount: 100, date: "2024-01-01" },
          { amount: 100, date: "2024-01-02" },
        ],
      };

      expect(calculateRemainingAmount(bonus)).toBe(300);
    });

    it("should calculate remaining amount for both total and each deposit requirements", () => {
      const bonus: Bonus = {
        id: "1",
        bankName: "Test Bank",
        accountType: "Checking",
        amount: 200,
        requirements: {
          deposits: {
            type: "both",
            totalAmount: 1000,
            eachAmount: 100,
            count: 10,
          },
          timeFrame: 90,
        },
        startDate: "2024-01-01",
        deposits: [
          { amount: 100, date: "2024-01-01" },
          { amount: 100, date: "2024-01-02" },
          { amount: 100, date: "2024-01-03" },
        ],
      };

      expect(calculateRemainingAmount(bonus)).toBe(700);
    });

    it("should return 0 when requirements are met", () => {
      const bonus: Bonus = {
        id: "1",
        bankName: "Test Bank",
        accountType: "Checking",
        amount: 200,
        requirements: {
          deposits: {
            type: "total",
            totalAmount: 1000,
          },
          timeFrame: 90,
        },
        startDate: "2024-01-01",
        deposits: [{ amount: 1000, date: "2024-01-01" }],
      };

      expect(calculateRemainingAmount(bonus)).toBe(0);
    });
  });
});
