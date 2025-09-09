import React, { useState, useEffect } from "react";
import { AccountsSidePanel } from "./AccountsSidePanel";
import { Card, CardContent } from "../../components/ui/card";
import { cn } from "../../lib/utils";

interface Transaction {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface AccountTransactionsPageProps {
  accountId: number;
}

const AccountTransactionsPage = ({ accountId }: AccountTransactionsPageProps) => {
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(accountId);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (selectedAccountId) {
      fetchTransactions(selectedAccountId);
    }
  }, [selectedAccountId]);

  const fetchTransactions = async (accountId: number) => {
    const res = await fetch(`/api/accounts/${accountId}/transactions`);
    const data = await res.json();
    setTransactions(data);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AccountsSidePanel
        selectedAccountId={selectedAccountId}
        onAccountSelect={setSelectedAccountId}
      />
      <div className="flex-1 p-4">
        {selectedAccountId ? (
          <Card className="w-full">
            <CardContent>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Transactions</h2>
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
                  >
                    <div>
                      <h3 className="font-medium">{transaction.description}</h3>
                      <p className="text-sm text-gray-600">{transaction.category}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          "font-medium",
                          transaction.amount < 0 ? "text-red-600" : "text-green-600"
                        )}
                      >
                        {transaction.amount < 0 ? "-" : ""}${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
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
