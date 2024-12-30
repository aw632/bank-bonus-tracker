import React, { useState } from 'react';
import { Bonus, DepositRequirement } from '../types/types';

interface AddBonusFormProps {
  onAddBonus: (bonus: Bonus) => void;
}

export default function AddBonusForm({ onAddBonus }: AddBonusFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    bankName: '',
    accountType: '',
    amount: '',
    depositType: 'total',
    totalAmount: '',
    eachAmount: '',
    count: '',
    timeFrame: '',
    holdPeriod: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const depositRequirement: DepositRequirement = {
      type: formData.depositType as 'total' | 'each' | 'both',
      totalAmount: formData.depositType !== 'each' ? parseFloat(formData.totalAmount) : undefined,
      eachAmount: formData.depositType !== 'total' ? parseFloat(formData.eachAmount) : undefined,
      count: formData.depositType !== 'total' ? parseInt(formData.count) : undefined,
    };

    const newBonus: Bonus = {
      id: Date.now().toString(),
      bankName: formData.bankName,
      accountType: formData.accountType,
      amount: parseFloat(formData.amount),
      requirements: {
        deposits: depositRequirement,
        timeFrame: parseInt(formData.timeFrame),
        holdPeriod: formData.holdPeriod ? parseInt(formData.holdPeriod) : undefined,
      },
      startDate: new Date().toISOString(),
      deposits: [],
    };

    onAddBonus(newBonus);
    setIsOpen(false);
    setFormData({
      bankName: '',
      accountType: '',
      amount: '',
      depositType: 'total',
      totalAmount: '',
      eachAmount: '',
      count: '',
      timeFrame: '',
      holdPeriod: ''
    });
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        {isOpen ? 'Cancel' : 'Add New Bonus'}
      </button>
      {isOpen && (
        <form onSubmit={handleSubmit} className="mt-4 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bankName">
              Bank Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="bankName"
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="accountType">
              Account Type
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
              Bonus Amount
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="amount"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="depositType">
              Deposit Requirement Type
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
          {(formData.depositType === 'total' || formData.depositType === 'both') && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="totalAmount">
                Total Deposit Amount Required
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="totalAmount"
                type="number"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleChange}
                required
              />
            </div>
          )}
          {(formData.depositType === 'each' || formData.depositType === 'both') && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="eachAmount">
                  Amount Required for Each Deposit
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="eachAmount"
                  type="number"
                  name="eachAmount"
                  value={formData.eachAmount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="count">
                  Number of Deposits Required
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="timeFrame">
              Time Frame (days)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="timeFrame"
              type="number"
              name="timeFrame"
              value={formData.timeFrame}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="holdPeriod">
              Hold Period (days, optional)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
  );
}

