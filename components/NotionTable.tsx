
import React from 'react';
import type { Transaction } from '../types';
import { Category, Status } from '../types';

interface NotionTableProps {
  transactions: Transaction[];
}

const CategoryBadge: React.FC<{ category: Category }> = ({ category }) => {
  const categoryColors: Record<Category, string> = {
    [Category.GROCERIES]: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    [Category.UTILITIES]: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    [Category.ENTERTAINMENT]: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    [Category.TRANSPORT]: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    [Category.SAVINGS]: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    [Category.INCOME]: 'bg-green-500/20 text-green-300 border-green-500/30',
    [Category.OTHER]: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${categoryColors[category] || categoryColors[Category.OTHER]}`}>
      {category}
    </span>
  );
};

const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
    const statusStyles: Record<Status, string> = {
        [Status.COMPLETED]: 'bg-green-500/20 text-green-300',
        [Status.PENDING]: 'bg-yellow-500/20 text-yellow-300 animate-pulse',
        [Status.CANCELLED]: 'bg-red-500/20 text-red-300 line-through',
    };
    const dotStyles: Record<Status, string> = {
        [Status.COMPLETED]: 'bg-green-400',
        [Status.PENDING]: 'bg-yellow-400',
        [Status.CANCELLED]: 'bg-red-400',
    }

    return (
        <span className={`inline-flex items-center gap-x-2 px-3 py-1 text-sm font-medium rounded-full ${statusStyles[status]}`}>
            <span className={`h-2 w-2 rounded-full ${dotStyles[status]}`}></span>
            {status}
        </span>
    );
};

const NotionTable: React.FC<NotionTableProps> = ({ transactions }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-300 sm:pl-6">Item</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">Category</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">Status</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">Date</th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-300">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800 bg-gray-900/50">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-800/60 transition-colors duration-200">
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">{transaction.name}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                <CategoryBadge category={transaction.category} />
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                <StatusBadge status={transaction.status} />
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">{formatDate(transaction.date)}</td>
              <td className={`whitespace-nowrap px-3 py-4 text-sm text-right font-mono ${transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(transaction.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NotionTable;
