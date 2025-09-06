
import React, { useState, useEffect } from 'react';
import type { Transaction } from './types';
import { fetchTransactions } from './services/notionService';
import NotionTable from './components/NotionTable';
import Spinner from './components/Spinner';
import { PiggyBank, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTransactions();
        setTransactions(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8">
          <Spinner />
          <p className="mt-4 text-lg text-gray-400">Fetching data from Notion...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-red-900/20 border border-red-500/50 rounded-lg">
          <AlertTriangle className="h-12 w-12 text-red-400" />
          <h2 className="mt-4 text-xl font-semibold text-red-300">Failed to load data</h2>
          <p className="mt-2 text-red-400">{error}</p>
        </div>
      );
    }

    if (transactions.length === 0) {
      return (
        <div className="text-center p-8 text-gray-500">
          <h2 className="text-xl font-semibold">No Transactions Found</h2>
          <p className="mt-2">The database is currently empty.</p>
        </div>
      );
    }

    return <NotionTable transactions={transactions} />;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-pink-500/20 p-3 rounded-lg">
              <PiggyBank className="h-8 w-8 text-pink-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Piggy Bank Transactions</h1>
              <p className="text-gray-400 mt-1">A view of your Notion savings database.</p>
            </div>
          </div>
        </header>
        
        <main className="bg-gray-800/50 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
          {renderContent()}
        </main>

        <footer className="text-center mt-8 text-gray-600 text-sm">
          <p>Note: This is a read-only view. Data is mocked for demonstration purposes.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
