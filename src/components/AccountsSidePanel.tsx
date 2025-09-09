import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { cn } from '../../lib/utils';
import { api, apiEndpoints } from '../lib/api';
import '../styles/AccountsSidePanel.css';

interface Account {
  id: number;
  name: string;
  account_number_last4: string;
  current_balance: number;
  currency: string;
}

interface AccountsSidePanelProps {
  selectedAccountId: number | null;
  onAccountSelect: (id: number) => void;
}

export function AccountsSidePanel({ selectedAccountId, onAccountSelect }: AccountsSidePanelProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(apiEndpoints.accounts.list);
        setAccounts(response.data);
      } catch (err) {
        console.error('Error fetching accounts:', err);
        setError('Failed to load accounts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  // Calculate total net worth from all accounts
  const netWorth = accounts.reduce((total, account) => total + (account.current_balance || 0), 0);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="accounts-side-panel">
      <div className="accounts-side-panel__content">
        <h2 className="accounts-header">Accounts</h2>
        
        {loading ? (
          <div className="loading-state">Loading accounts...</div>
        ) : error ? (
          <div className="error-state">Error: {error}</div>
        ) : (
          <div className="accounts-list">
            {accounts.map((account) => (
              <div
                key={account.id}
                className={cn(
                  'account-card',
                  selectedAccountId === account.id && 'selected'
                )}
                onClick={() => onAccountSelect(account.id)}
              >
                <div className="account-card-content">
                  <div className="account-info">
                    <div className="account-name">{account.name}</div>
                    <div className="account-number">(xxxx{account.account_number_last4})</div>
                  </div>
                  <div className="account-balance">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: account.currency || 'USD',
                    }).format(account.current_balance || 0)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Net Worth Section - Outside scrollable area */}
      <div className="net-worth-section">
        <div className="net-worth-label">Net Worth</div>
        <div className="net-worth-amount">{formatCurrency(netWorth)}</div>
      </div>
    </div>
  );
}
