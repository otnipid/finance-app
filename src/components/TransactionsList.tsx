import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { apiService } from '../lib/api';
import { Transaction } from '../types';
import '../styles/MainContent.css';

interface TransactionsListProps {
  accountId: string | null;
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
        const response = await apiService.getAccountTransactions(accountId);
        // Sort transactions by posted_date in descending order
        const sortedTransactions = [...response.data].sort((a, b) => 
          new Date(b.posted_date).getTime() - new Date(a.posted_date).getTime()
        );
        setTransactions(sortedTransactions);
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
      currency: currency || 'USD',
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
                <div className="transaction-card__description">
                  {transaction.description || 'No description'}
                </div>
                <div className="transaction-card__details">
                  <span className="transaction-card__date">
                    {formatDate(transaction.posted_date)}
                  </span>
                  {transaction.payee && (
                    <span className="transaction-card__payee">
                      • {transaction.payee}
                    </span>
                  )}
                  {transaction.memo && (
                    <span className="transaction-card__memo">
                      • {transaction.memo}
                    </span>
                  )}
                </div>
              </div>
              <div className={`transaction-card__amount ${transaction.amount < 0 ? 'negative' : 'positive'}`}>
                {formatCurrency(transaction.amount, transaction.account?.currency)}
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
