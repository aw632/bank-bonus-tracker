"use client";

import React, { useState } from "react";
import { Bonus, DepositRequirement } from "../../types/types";

interface AddBonusFormProps {
  onAddBonus: (bonus: Bonus) => void;
}

type FormMode = "quick" | "manual" | "review";

export default function AddBonusForm({ onAddBonus }: AddBonusFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("quick");
  const [bonusText, setBonusText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    bankName: "",
    accountType: "",
    amount: "",
    depositType: "total",
    totalAmount: "",
    eachAmount: "",
    count: "",
    timeFrame: "",
    holdPeriod: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    if (e.target.name === "bonusText") {
      setBonusText(e.target.value);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const parseText = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/parse-bonus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: bonusText }),
      });

      if (!response.ok) throw new Error("Failed to parse bonus text");

      const parsedBonus = await response.json();

      setFormData({
        bankName: parsedBonus.bankName,
        accountType: parsedBonus.accountType,
        amount: parsedBonus.amount.toString(),
        depositType: parsedBonus.requirements.deposits.type,
        totalAmount:
          parsedBonus.requirements.deposits.totalAmount?.toString() || "",
        eachAmount:
          parsedBonus.requirements.deposits.eachAmount?.toString() || "",
        count: parsedBonus.requirements.deposits.count?.toString() || "",
        timeFrame: parsedBonus.requirements.timeFrame.toString(),
        holdPeriod: parsedBonus.requirements.holdPeriod?.toString() || "",
      });

      setFormMode("review");
    } catch (error) {
      console.error("Error parsing bonus text:", error);
      alert(
        "Failed to parse bonus text. Please check the format and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const depositRequirement: DepositRequirement = {
      type: formData.depositType as "total" | "each" | "both",
      totalAmount:
        formData.depositType !== "each"
          ? parseFloat(formData.totalAmount)
          : undefined,
      eachAmount:
        formData.depositType !== "total"
          ? parseFloat(formData.eachAmount)
          : undefined,
      count:
        formData.depositType !== "total" ? parseInt(formData.count) : undefined,
    };

    const newBonus: Bonus = {
      id: Date.now().toString(),
      bankName: formData.bankName,
      accountType: formData.accountType,
      amount: parseFloat(formData.amount),
      requirements: {
        deposits: depositRequirement,
        timeFrame: parseInt(formData.timeFrame),
        holdPeriod: formData.holdPeriod
          ? parseInt(formData.holdPeriod)
          : undefined,
      },
      startDate: new Date().toISOString(),
      deposits: [],
    };

    onAddBonus(newBonus);
    setIsOpen(false);
    setFormMode("quick");
    setFormData({
      bankName: "",
      accountType: "",
      amount: "",
      depositType: "total",
      totalAmount: "",
      eachAmount: "",
      count: "",
      timeFrame: "",
      holdPeriod: "",
    });
    setBonusText("");
  };

  const getFormTitle = () => {
    switch (formMode) {
      case "quick":
        return "Quick Add Bonus";
      case "manual":
        return "Manual Entry";
      case "review":
        return "Review Parsed Bonus";
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
        } text-primary-foreground px-4 py-2 rounded transition-colors`}
      >
        {isOpen ? "Cancel" : "Add New Bonus"}
      </button>
      {isOpen && (
        <div className="mt-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm px-8 pt-6 pb-8 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{getFormTitle()}</h2>
              {formMode !== "review" && (
                <button
                  onClick={() =>
                    setFormMode(formMode === "quick" ? "manual" : "quick")
                  }
                  className="text-sm px-3 py-1 rounded bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
                >
                  Switch to{" "}
                  {formMode === "quick" ? "Manual Entry" : "Quick Add"}
                </button>
              )}
            </div>

            {formMode === "quick" ? (
              <div>
                <div className="mb-4">
                  <label
                    className="block text-sm font-bold mb-2"
                    htmlFor="bonusText"
                  >
                    Paste Bonus Description
                  </label>
                  <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 bg-background text-foreground leading-tight focus:outline-none focus:shadow-outline"
                    id="bonusText"
                    name="bonusText"
                    value={bonusText}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Paste the bonus description here, and AI will parse the bonus details and add it to the tracker."
                  />
                </div>
                <button
                  onClick={parseText}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline inline-flex items-center"
                  type="button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Parsing...
                    </>
                  ) : (
                    "Parse with AI"
                  )}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    className="block text-sm font-bold mb-2"
                    htmlFor="bankName"
                  >
                    Bank Name
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 bg-background text-foreground leading-tight focus:outline-none focus:shadow-outline"
                    id="bankName"
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-sm font-bold mb-2"
                    htmlFor="accountType"
                  >
                    Account Type
                  </label>
                  <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 bg-background text-foreground leading-tight focus:outline-none focus:shadow-outline"
                    id="accountType"
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select account type</option>
                    <option value="Checking">Checking</option>
                    <option value="Savings">Savings</option>
                    <option value="Money Market">Money Market</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    className="block text-sm font-bold mb-2"
                    htmlFor="amount"
                  >
                    Bonus Amount
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 bg-background text-foreground leading-tight focus:outline-none focus:shadow-outline"
                    id="amount"
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-sm font-bold mb-2"
                    htmlFor="depositType"
                  >
                    Deposit Requirement Type
                  </label>
                  <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 bg-background text-foreground leading-tight focus:outline-none focus:shadow-outline"
                    id="depositType"
                    name="depositType"
                    value={formData.depositType}
                    onChange={handleChange}
                    required
                  >
                    <option value="total">Total Amount</option>
                    <option value="each">Each Deposit</option>
                    <option value="both">Both Total and Each</option>
                  </select>
                </div>
                {(formData.depositType === "total" ||
                  formData.depositType === "both") && (
                  <div className="mb-4">
                    <label
                      className="block text-sm font-bold mb-2"
                      htmlFor="totalAmount"
                    >
                      Total Deposit Amount Required
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 bg-background text-foreground leading-tight focus:outline-none focus:shadow-outline"
                      id="totalAmount"
                      type="number"
                      name="totalAmount"
                      value={formData.totalAmount}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}
                {(formData.depositType === "each" ||
                  formData.depositType === "both") && (
                  <>
                    <div className="mb-4">
                      <label
                        className="block text-sm font-bold mb-2"
                        htmlFor="eachAmount"
                      >
                        Amount Required for Each Deposit
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 bg-background text-foreground leading-tight focus:outline-none focus:shadow-outline"
                        id="eachAmount"
                        type="number"
                        name="eachAmount"
                        value={formData.eachAmount}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-sm font-bold mb-2"
                        htmlFor="count"
                      >
                        Number of Deposits Required
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 bg-background text-foreground leading-tight focus:outline-none focus:shadow-outline"
                        id="count"
                        type="number"
                        name="count"
                        value={formData.count}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </>
                )}
                <div className="mb-4">
                  <label
                    className="block text-sm font-bold mb-2"
                    htmlFor="timeFrame"
                  >
                    Time Frame (days)
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 bg-background text-foreground leading-tight focus:outline-none focus:shadow-outline"
                    id="timeFrame"
                    type="number"
                    name="timeFrame"
                    value={formData.timeFrame}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-sm font-bold mb-2"
                    htmlFor="holdPeriod"
                  >
                    Hold Period (days, optional)
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 bg-background text-foreground leading-tight focus:outline-none focus:shadow-outline"
                    id="holdPeriod"
                    type="number"
                    name="holdPeriod"
                    value={formData.holdPeriod}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    Add Bonus
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
