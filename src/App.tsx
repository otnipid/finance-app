import React, { useState } from "react";
import { Tab } from "@headlessui/react";
import { AccountsSidePanel } from "./components/AccountsSidePanel";
import { TransactionsList } from "./components/TransactionsList";
import cn from 'classnames';
import './styles/MainContent.css';
import './styles/AccountsSidePanel.css';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function App() {
  const [activeTab, setActiveTab] = useState("savings");
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);

  const tabs = [
    { name: "Savings", value: "savings" },
    { name: "Budgets", value: "budgets" },
    { name: "Investments", value: "investments" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header - Fixed at the top */}
      <header className="bg-white shadow z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Personal Finance Dashboard
          </h1>

          {/* Tabs Container */}
          <div className="flex justify-center">
            <nav className="tabs-container">
              {tabs.map((tab) => (
                <div
                  key={tab.value}
                  className={`new-tab-root ${activeTab === tab.value ? 'selected' : ''}`}
                  onClick={() => setActiveTab(tab.value)}
                >
                  <span>{tab.name}</span>
                </div>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="app-layout">
        {/* Side Panel */}
        <div className="side-panel">
          <AccountsSidePanel
            selectedAccountId={selectedAccountId}
            onAccountSelect={setSelectedAccountId}
          />
        </div>

        {/* Content View */}
        <div className="content-view">
          <div className="content-view-inner p-6">
            {activeTab === 'savings' && (
              <div className="content-card">
                <TransactionsList accountId={selectedAccountId} />
              </div>
            )}
            {activeTab === 'budgets' && (
              <div className="content-card">
                <h2>Budgets</h2>
                {/* Add your budgets content here */}
              </div>
            )}
            {activeTab === 'investments' && (
              <div className="content-card">
                <h2>Investments</h2>
                {/* Add your investments content here */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
