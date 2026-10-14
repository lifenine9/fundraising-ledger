import ledgerData from "../../data/transactions.json";

export type TransactionType = "deposit" | "withdrawal";

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  amount: number;
  comment?: string;
}

interface LedgerData {
  version: number;
  currency: "KRW";
  openingBalance: number;
  transactions: Transaction[];
}

const data = ledgerData as LedgerData;

export const openingBalance = data.openingBalance;
export const transactions = data.transactions;

export function calculateSummary(items: Transaction[] = transactions) {
  const depositTotal = items
    .filter((item) => item.type === "deposit")
    .reduce((sum, item) => sum + item.amount, 0);

  const withdrawalTotal = items
    .filter((item) => item.type === "withdrawal")
    .reduce((sum, item) => sum + item.amount, 0);

  return {
    depositTotal,
    withdrawalTotal,
    balance: openingBalance + depositTotal - withdrawalTotal,
    transactionCount: items.length,
  };
}

export function formatWon(amount: number): string {
  return `${new Intl.NumberFormat("ko-KR", {
    maximumFractionDigits: 0,
  }).format(amount)}원`;
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(date));
}
