import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { api, apiEndpoints } from '../lib/api';
import '../styles/MainContent.css';

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  currency: string;
  category: string;
  account_id: number;
}

interface TransactionsListProps {
  accountId: number | null;
}

export function TransactionsList({ accountId }: TransactionsListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!accountId) {
        setTransactions([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await api.get(apiEndpoints.transactions.list, {
          params: { account_id: accountId, sort: '-date' }
        });
        setTransactions(response.data);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transactions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [accountId]);

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!accountId) {
    return (
      <div className="transaction-list__empty">
        <p>Select an account to view transactions</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="transaction-list__empty">
        <p>Loading transactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="transaction-list__empty">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      <h2 className="transaction-list__header">Transactions</h2>
      {transactions.length === 0 ? (
        <p className="transaction-list__empty">No transactions found for this account.</p>
      ) : (
        transactions.map((transaction) => (
          <Card key={transaction.id} className="transaction-card">
            <div className="transaction-card__content">
              <div className="transaction-card__info">
                <h3>{transaction.description}</h3>
                <p className="transaction-card__meta">
                  {formatDate(transaction.date)} • {transaction.category || 'Uncategorized'}
                </p>
              </div>
              <div 
                className={`transaction-card__amount ${
                  transaction.amount < 0 
                    ? 'transaction-card__amount--debit' 
                    : 'transaction-card__amount--credit'
                }`}
              >
                {formatCurrency(transaction.amount, transaction.currency)}
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
