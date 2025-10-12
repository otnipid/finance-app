import axios, { AxiosResponse } from 'axios';
import { 
  Account, AccountCreate, AccountUpdate,
  Transaction, TransactionCreate, TransactionUpdate,
  BudgetCategory, BudgetCategoryCreate, BudgetCategoryUpdate,
  SavingsBucket, SavingsBucketCreate, SavingsBucketUpdate
} from '../types';

// In development, use relative URLs (handled by Vite proxy)
// In production, use the full URL to the API service
const API_BASE_URL = import.meta.env.PROD 
  ? 'http://finance-api:80'  // Production URL (in-cluster)
  : '';                      // Development (relative URLs)

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor to ensure consistent trailing slashes
api.interceptors.request.use(config => {
  // Skip for non-API URLs or URLs that already end with a slash
  if (config.url && !config.url.endsWith('/') && 
      !config.url.includes('.')) {  // Skip for static assets
    config.url += '/';
  }
  return config;
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add authentication headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.data);
      if (error.response.status === 401) {
        // Handle unauthorized
        console.error('Unauthorized access - please log in');
      } else if (error.response.status === 404) {
        console.error('The requested resource was not found');
      } else if (error.response.status >= 500) {
        console.error('Server error - please try again later');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network Error:', error.message);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const apiEndpoints = {
  accounts: {
    list: '/accounts/',
    get: (id: string) => `/accounts/${id}/`,
    create: '/accounts/',
    update: (id: string) => `/accounts/${id}/`,
    delete: (id: string) => `/accounts/${id}/`,
    transactions: (accountId: string) => `/accounts/${accountId}/transactions/`,
  },
  transactions: {
    list: '/transactions/',
    get: (id: string) => `/transactions/${id}/`,
    create: '/transactions/',
    update: (id: string) => `/transactions/${id}/`,
    delete: (id: string) => `/transactions/${id}/`,
  },
  budgetCategories: {
    list: '/budget-categories/',
    get: (id: number) => `/budget-categories/${id}/`,
    create: '/budget-categories/',
    update: (id: number) => `/budget-categories/${id}/`,
    delete: (id: number) => `/budget-categories/${id}/`,
  },
  savingsBuckets: {
    list: '/savings-buckets/',
    get: (id: number) => `/savings-buckets/${id}/`,
    create: '/savings-buckets/',
    update: (id: number) => `/savings-buckets/${id}/`,
    delete: (id: number) => `/savings-buckets/${id}/`,
  },
};

// API service functions
export const apiService = {
  // Account operations
  getAccounts: (): Promise<AxiosResponse<Account[]>> => 
    api.get(apiEndpoints.accounts.list),
    
  getAccount: (id: string): Promise<AxiosResponse<Account>> => 
    api.get(apiEndpoints.accounts.get(id)),
    
  createAccount: (data: AccountCreate): Promise<AxiosResponse<Account>> => 
    api.post(apiEndpoints.accounts.create, data),
    
  updateAccount: (id: string, data: AccountUpdate): Promise<AxiosResponse<Account>> => 
    api.patch(apiEndpoints.accounts.update(id), data),
    
  deleteAccount: (id: string): Promise<AxiosResponse<void>> => 
    api.delete(apiEndpoints.accounts.delete(id)),

  // Transaction operations
  getTransactions: (params?: { account_id?: string }): Promise<AxiosResponse<Transaction[]>> => 
    api.get(apiEndpoints.transactions.list, { params }),
    
  getAccountTransactions: (accountId: string): Promise<AxiosResponse<Transaction[]>> => 
    api.get(apiEndpoints.accounts.transactions(accountId)),
    
  getTransaction: (id: string): Promise<AxiosResponse<Transaction>> => 
    api.get(apiEndpoints.transactions.get(id)),
    
  createTransaction: (data: TransactionCreate): Promise<AxiosResponse<Transaction>> => 
    api.post(apiEndpoints.transactions.create, data),
    
  updateTransaction: (id: string, data: TransactionUpdate): Promise<AxiosResponse<Transaction>> => 
    api.patch(apiEndpoints.transactions.update(id), data),
    
  deleteTransaction: (id: string): Promise<AxiosResponse<void>> => 
    api.delete(apiEndpoints.transactions.delete(id)),

  // Budget Category operations
  getBudgetCategories: (): Promise<AxiosResponse<BudgetCategory[]>> => 
    api.get(apiEndpoints.budgetCategories.list),
    
  getBudgetCategory: (id: number): Promise<AxiosResponse<BudgetCategory>> => 
    api.get(apiEndpoints.budgetCategories.get(id)),
    
  createBudgetCategory: (data: BudgetCategoryCreate): Promise<AxiosResponse<BudgetCategory>> => 
    api.post(apiEndpoints.budgetCategories.create, data),
    
  updateBudgetCategory: (id: number, data: BudgetCategoryUpdate): Promise<AxiosResponse<BudgetCategory>> => 
    api.patch(apiEndpoints.budgetCategories.update(id), data),
    
  deleteBudgetCategory: (id: number): Promise<AxiosResponse<void>> => 
    api.delete(apiEndpoints.budgetCategories.delete(id)),

  // Savings Bucket operations
  getSavingsBuckets: (): Promise<AxiosResponse<SavingsBucket[]>> => 
    api.get(apiEndpoints.savingsBuckets.list),
    
  getSavingsBucket: (id: number): Promise<AxiosResponse<SavingsBucket>> => 
    api.get(apiEndpoints.savingsBuckets.get(id)),
    
  createSavingsBucket: (data: SavingsBucketCreate): Promise<AxiosResponse<SavingsBucket>> => 
    api.post(apiEndpoints.savingsBuckets.create, data),
    
  updateSavingsBucket: (id: number, data: SavingsBucketUpdate): Promise<AxiosResponse<SavingsBucket>> => 
    api.patch(apiEndpoints.savingsBuckets.update(id), data),
    
  deleteSavingsBucket: (id: number): Promise<AxiosResponse<void>> => 
    api.delete(apiEndpoints.savingsBuckets.delete(id)),
};
