import React, { useState, useEffect } from "react";
import { AccountsSidePanel } from "./AccountsSidePanel";
import { Card, CardContent } from "../../components/ui/card";
import { cn } from "../../lib/utils";
import { apiService } from "../lib/api";
import { Transaction } from "../types";

interface AccountTransactionsPageProps {
  accountId: string;
}

const AccountTransactionsPage = ({ accountId }: AccountTransactionsPageProps) => {
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(accountId);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async (accountId: string) => {
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

    if (selectedAccountId) {
      fetchTransactions(selectedAccountId);
    } else {
      setTransactions([]);
    }
  }, [selectedAccountId]);

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

  return (
    <div className="flex h-screen bg-gray-50">
      <AccountsSidePanel
        selectedAccountId={selectedAccountId}
        onAccountSelect={setSelectedAccountId}
      />
      <div className="flex-1 p-4 overflow-auto">
        {selectedAccountId ? (
          <Card className="w-full">
            <CardContent className="p-4">
              <h2 className="text-2xl font-bold mb-4">Transactions</h2>
              
              {loading ? (
                <div className="flex justify-center p-8">
                  <p>Loading transactions...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                  <p className="text-red-700">{error}</p>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center p-8 text-gray-500">
                  No transactions found for this account.
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {transaction.description || 'No description'}
                        </h3>
                        <div className="flex flex-wrap items-center text-sm text-gray-500 space-x-2 mt-1">
                          <span>{formatDate(transaction.posted_date)}</span>
                          {transaction.payee && (
                            <span className="hidden sm:inline">• {transaction.payee}</span>
                          )}
                          {transaction.memo && (
                            <span className="text-gray-400 text-sm truncate">
                              {transaction.memo}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <p
                          className={cn(
                            "font-medium text-sm sm:text-base",
                            transaction.amount < 0 ? "text-red-600" : "text-green-600"
                          )}
                        >
                          {formatCurrency(transaction.amount, transaction.account?.currency)}
                        </p>
                        {transaction.pending && (
                          <span className="inline-block px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select an account to view transactions</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountTransactionsPage;
