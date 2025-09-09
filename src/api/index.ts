// src/api.ts
import { Transaction, Account, BudgetCategory, SavingsBucket } from "../types";

const apiBase = "/api";

export async function fetchTransactions(): Promise<Transaction[]> {
  const res = await fetch(`${apiBase}/transactions`);
  return res.json();
}

export async function createTransaction(data: Omit<Transaction, "id" | "created_at">) {
  await fetch(`${apiBase}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateTransaction(id: number, data: Omit<Transaction, "id" | "created_at">) {
  await fetch(`${apiBase}/transactions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteTransaction(id: number) {
  await fetch(`${apiBase}/transactions/${id}`, { method: "DELETE" });
}

// Repeat similarly for Accounts, BudgetCategories, and SavingsBuckets
// Example:
export async function fetchAccounts(): Promise<Account[]> {
  const res = await fetch(`${apiBase}/accounts/`);
  return res.json();
}
// ... and so on for create, update, delete
