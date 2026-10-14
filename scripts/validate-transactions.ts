import fs from "node:fs";
import path from "node:path";

type TransactionType = "deposit" | "withdrawal";
interface Transaction {
  id: string; date: string; type: TransactionType; category: string;
  amount: number; balanceAfter: number; comment?: string;
}
interface LedgerData {
  version: number; currency: string; openingBalance: number; transactions: Transaction[];
}
const filePath = path.join(process.cwd(), "data", "transactions.json");
function fail(message: string): never {
  console.error(`데이터 검증 실패: ${message}`);
  process.exit(1);
}
let data: LedgerData;
try { data = JSON.parse(fs.readFileSync(filePath, "utf8")) as LedgerData; }
catch (error) { fail(`transactions.json을 읽거나 파싱할 수 없습니다. ${String(error)}`); }
if (data.version !== 2) fail("version은 2이어야 합니다.");
if (data.currency !== "KRW") fail('currency는 현재 "KRW"만 지원합니다.');
if (!Number.isSafeInteger(data.openingBalance) || data.openingBalance < 0) fail("openingBalance는 0 이상의 정수여야 합니다.");
if (!Array.isArray(data.transactions)) fail("transactions는 배열이어야 합니다.");
const ids = new Set<string>();
let deposits = 0;
let withdrawals = 0;
let previousBalance: number | null = null;
for (const [index, transaction] of data.transactions.entries()) {
  const label = `transactions[${index}]`;
  if (!transaction || typeof transaction !== "object") fail(`${label} 항목이 객체가 아닙니다.`);
  if (typeof transaction.id !== "string" || transaction.id.trim() === "") fail(`${label}.id가 필요합니다.`);
  if (ids.has(transaction.id)) fail(`중복된 ID가 있습니다: ${transaction.id}`);
  ids.add(transaction.id);
  if (typeof transaction.date !== "string" || Number.isNaN(Date.parse(transaction.date))) fail(`${label}.date가 유효한 날짜가 아닙니다.`);
  if (!/[+-]\d{2}:\d{2}$/.test(transaction.date) && !transaction.date.endsWith("Z")) fail(`${label}.date에는 시간대(+09:00 등)를 포함하세요.`);
  if (transaction.type !== "deposit" && transaction.type !== "withdrawal") fail(`${label}.type은 deposit 또는 withdrawal이어야 합니다.`);
  if (typeof transaction.category !== "string" || transaction.category.trim() === "") fail(`${label}.category에는 은행 거래구분이 필요합니다.`);
  if (!Number.isSafeInteger(transaction.amount) || transaction.amount < 0) fail(`${label}.amount는 0 이상의 정수여야 합니다.`);
  if (!Number.isSafeInteger(transaction.balanceAfter) || transaction.balanceAfter < 0) fail(`${label}.balanceAfter는 0 이상의 정수여야 합니다.`);
  if (transaction.comment !== undefined && typeof transaction.comment !== "string") fail(`${label}.comment는 문자열이어야 합니다.`);
  if (transaction.type === "deposit") deposits += transaction.amount; else withdrawals += transaction.amount;
  previousBalance = transaction.balanceAfter;
}
const calculatedBalance = data.openingBalance + deposits - withdrawals;
console.log("데이터 검증 성공");
console.log(`거래 건수: ${data.transactions.length}`);
console.log(`누적 입금: ${deposits.toLocaleString("ko-KR")}원`);
console.log(`누적 출금: ${withdrawals.toLocaleString("ko-KR")}원`);
console.log(`계산 잔액: ${calculatedBalance.toLocaleString("ko-KR")}원`);
if (previousBalance !== null && previousBalance !== calculatedBalance) console.warn(`주의: 마지막 거래 후 잔액(${previousBalance.toLocaleString("ko-KR")}원)과 계산 잔액이 다릅니다.`);
