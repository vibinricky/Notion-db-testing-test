
export enum Category {
  GROCERIES = 'Groceries',
  UTILITIES = 'Utilities',
  ENTERTAINMENT = 'Entertainment',
  TRANSPORT = 'Transport',
  SAVINGS = 'Savings',
  INCOME = 'Income',
  OTHER = 'Other'
}

export enum Status {
  COMPLETED = 'Completed',
  PENDING = 'Pending',
  CANCELLED = 'Cancelled'
}

export interface Transaction {
  id: string;
  name: string;
  category: Category;
  amount: number;
  date: string;
  status: Status;
}
