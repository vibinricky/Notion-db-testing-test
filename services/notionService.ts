
import type { Transaction } from '../types';
import { Category, Status } from '../types';

const mockTransactions: Transaction[] = [
  { id: '1', name: 'Initial Deposit', category: Category.INCOME, amount: 1500.00, date: '2023-10-01', status: Status.COMPLETED },
  { id: '2', name: 'Weekly Groceries', category: Category.GROCERIES, amount: -75.50, date: '2023-10-05', status: Status.COMPLETED },
  { id: '3', name: 'Movie Night', category: Category.ENTERTAINMENT, amount: -25.00, date: '2023-10-07', status: Status.COMPLETED },
  { id: '4', name: 'Electricity Bill', category: Category.UTILITIES, amount: -120.25, date: '2023-10-10', status: Status.COMPLETED },
  { id: '5', name: 'Bus Fare', category: Category.TRANSPORT, amount: -15.75, date: '2023-10-12', status: Status.PENDING },
  { id: '6', name: 'Freelance Payment', category: Category.INCOME, amount: 500.00, date: '2023-10-15', status: Status.COMPLETED },
  { id: '7', name: 'Contribution to Savings', category: Category.SAVINGS, amount: -200.00, date: '2023-10-16', status: Status.COMPLETED },
  { id: '8', name: 'Internet Bill', category: Category.UTILITIES, amount: -60.00, date: '2023-10-20', status: Status.COMPLETED },
  { id: '9', name: 'Concert Tickets', category: Category.ENTERTAINMENT, amount: -150.00, date: '2023-10-22', status: Status.CANCELLED },
  { id: '10', name: 'Dinner with Friends', category: Category.ENTERTAINMENT, amount: -55.40, date: '2023-10-25', status: Status.COMPLETED },
];

/**
 * Fetches transaction data.
 * 
 * NOTE: In a real-world application, this function would make a secure call 
 * to a backend server. The backend would then use the Notion API key to fetch 
 * data from the database. Exposing API keys on the frontend is a security risk.
 * 
 * Example backend call:
 * const response = await fetch('/api/notion-data');
 * if (!response.ok) {
 *   throw new Error('Failed to fetch data from Notion');
 * }
 * return response.json();
 */
export const fetchTransactions = (): Promise<Transaction[]> => {
  console.log("Fetching mock data...");
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      // To test error handling, uncomment the following line:
      // reject(new Error('Failed to connect to the Notion API.'));
      resolve(mockTransactions);
    }, 1500);
  });
};
