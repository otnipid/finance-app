export enum AccountType {
  CHECKING = "checking",
  SAVINGS = "savings",
  CREDIT_CARD = "credit_card",
  LOAN = "loan",
  INVESTMENT = "investment",
  OTHER = "other"
}

export enum TransactionStatus {
  PENDING = "pending",
  POSTED = "posted",
  CANCELLED = "cancelled"
}

export interface AccountBase {
  name: string;
  type?: AccountType;
  currency?: string;
  balance?: number;
  org_name?: string;
  url?: string;
}

export interface TransactionBase {
  account_id: string;
  posted_date: string; // ISO date string
  description?: string;
  amount: number;
  memo?: string;
  payee?: string;
  pending?: boolean;
}

export interface Account extends AccountBase {
  id: string;
}

export interface Transaction extends TransactionBase {
  id: string;
  account?: Account; // Optional account relationship
}

export interface BudgetCategoryBase {
  name: string;
  monthly_limit: number;
}

export interface BudgetCategory extends BudgetCategoryBase {
  id: number;
  created_at?: string; // ISO date string
}

export interface SavingsBucketBase {
  name: string;
  target_amount: number;
  current_amount?: number;
  goal_date?: string; // ISO date string
}

export interface SavingsBucket extends SavingsBucketBase {
  id: number;
  created_at?: string; // ISO date string
}

// Request/Response types for API calls
export interface AccountCreate extends AccountBase {
  id: string; // SimpleFin account ID
}

export interface TransactionCreate extends TransactionBase {
  id: string; // SimpleFin transaction ID
}

export interface AccountUpdate extends Partial<AccountBase> {}
export interface TransactionUpdate extends Partial<TransactionBase> {
  id: string;
  account_id?: string;
}

export interface BudgetCategoryCreate extends BudgetCategoryBase {}
export interface BudgetCategoryUpdate extends Partial<BudgetCategoryBase> {}

export interface SavingsBucketCreate extends Omit<SavingsBucketBase, 'current_amount'> {
  current_amount?: number;
}

export interface SavingsBucketUpdate extends Partial<SavingsBucketBase> {}