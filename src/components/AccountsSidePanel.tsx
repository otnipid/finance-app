import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { cn } from '../../lib/utils';
import { apiService } from '../lib/api';
import { Account } from '../types';
import '../styles/AccountsSidePanel.css';

interface AccountsSidePanelProps {
  selectedAccountId: string | null;
  onAccountSelect: (id: string) => void;
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
        const response = await apiService.getAccounts();
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
  const netWorth = accounts.reduce((total, account) => total + (account.balance || 0), 0);

  // Format currency
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Extract last 4 digits of account ID for display
  const getLastFourDigits = (id: string) => {
    return id.slice(-4);
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
                    {account.org_name && (
                      <div className="account-org">{account.org_name}</div>
                    )}
                    <div className="account-type">
                      {account.type ? account.type.replace('_', ' ') : 'Account'} ••••{getLastFourDigits(account.id)}
                    </div>
                  </div>
                  <div className="account-balance">
                    {formatCurrency(account.balance || 0, account.currency)}
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
