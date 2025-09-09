export interface Transaction {
    id: number;
    description: string;
    amount: number;
    account_id: number;
    budget_category_id: number;
    created_at: string;
  }
  
  export interface Account {
    id: number;
    name: string;
    current_balance: number;
    created_at: string;
  }
  
  export interface BudgetCategory {
    id: number;
    name: string;
    monthly_limit: number;
    created_at: string;
  }
  
  export interface SavingsBucket {
    id: number;
    name: string;
    goal: number;
  }
  