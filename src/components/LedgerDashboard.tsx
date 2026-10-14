"use client";

import { useMemo, useState } from "react";
import type { Transaction, TransactionType } from "@/lib/ledger";
import { formatDate, formatWon } from "@/lib/ledger";

type Filter = "all" | TransactionType;

export default function LedgerDashboard({ transactions }: { transactions: Transaction[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const sortedTransactions = useMemo(
    () => [...transactions].sort((a, b) => Date.parse(b.date) - Date.parse(a.date)),
    [transactions],
  );

  const filteredTransactions = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ko-KR");

    return sortedTransactions.filter((transaction) => {
      if (filter !== "all" && transaction.type !== filter) return false;

      const date = new Date(transaction.date);
      const dateKey = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(date);

      if (fromDate && dateKey < fromDate) return false;
      if (toDate && dateKey > toDate) return false;

      if (normalizedQuery) {
        const haystack = `${transaction.id} ${transaction.category} ${transaction.comment ?? ""} ${transaction.amount} ${transaction.balanceAfter}`.toLocaleLowerCase("ko-KR");
        if (!haystack.includes(normalizedQuery)) return false;
      }
      return true;
    });
  }, [sortedTransactions, query, filter, fromDate, toDate]);

  const resetFilters = () => {
    setQuery("");
    setFilter("all");
    setFromDate("");
    setToDate("");
  };

  return (
    <section className="ledger-section" aria-labelledby="transactions-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">TRANSACTION HISTORY</p>
          <h2 id="transactions-heading">전체 거래내역</h2>
        </div>
        <span className="transaction-count">{filteredTransactions.length.toLocaleString("ko-KR")}건</span>
      </div>

      <div className="filters">
        <label className="search-field">
          <span className="sr-only">거래 검색</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></svg>
          <input
            type="search"
            placeholder="거래구분, 내용, 금액, 거래 ID 검색"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <div className="filter-tabs" role="group" aria-label="거래 유형 필터">
          <button type="button" className={filter === "all" ? "filter-tab active" : "filter-tab"} onClick={() => setFilter("all")}>전체</button>
          <button type="button" className={filter === "deposit" ? "filter-tab active" : "filter-tab"} onClick={() => setFilter("deposit")}>입금</button>
          <button type="button" className={filter === "withdrawal" ? "filter-tab active" : "filter-tab"} onClick={() => setFilter("withdrawal")}>출금</button>
        </div>

        <div className="date-filters">
          <label>
            <span>시작일</span>
            <input type="date" value={fromDate} max={toDate || undefined} onChange={(event) => setFromDate(event.target.value)} />
          </label>
          <span className="date-separator" aria-hidden="true">—</span>
          <label>
            <span>종료일</span>
            <input type="date" value={toDate} min={fromDate || undefined} onChange={(event) => setToDate(event.target.value)} />
          </label>
          <button type="button" className="reset-button" onClick={resetFilters}>초기화</button>
        </div>
      </div>

      {filteredTransactions.length > 0 ? (
        <>
          <div className="desktop-table-wrap">
            <table className="transaction-table">
              <thead>
                <tr>
                  <th scope="col">거래일시</th>
                  <th scope="col">구분</th>
                  <th scope="col">거래구분</th>
                  <th scope="col">내용</th>
                  <th scope="col" className="amount-heading">거래 금액</th>
                  <th scope="col" className="amount-heading">거래 후 잔액</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="date-cell">{formatDate(transaction.date)}</td>
                    <td>
                      <span className={`transaction-badge ${transaction.type}`}>
                        <span className="badge-dot" />
                        {transaction.type === "deposit" ? "입금" : "출금"}
                      </span>
                    </td>
                    <td><span className="category-badge">{transaction.category}</span></td>
                    <td>
                      <div className="transaction-comment">{transaction.comment?.trim() || "내용 미기재"}</div>
                      <div className="transaction-id">{transaction.id}</div>
                    </td>
                    <td className={`amount-cell ${transaction.type}`}>
                      {transaction.type === "deposit" ? "+" : "−"}{formatWon(transaction.amount)}
                    </td>
                    <td className="balance-after-cell">{formatWon(transaction.balanceAfter)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mobile-transactions">
            {filteredTransactions.map((transaction) => (
              <article className="mobile-transaction" key={transaction.id}>
                <div className="mobile-transaction-top">
                  <span className={`transaction-badge ${transaction.type}`}>
                    <span className="badge-dot" />
                    {transaction.type === "deposit" ? "입금" : "출금"}
                  </span>
                  <span className={`amount-cell ${transaction.type}`}>
                    {transaction.type === "deposit" ? "+" : "−"}{formatWon(transaction.amount)}
                  </span>
                </div>
                <p className="mobile-category">{transaction.category}</p>
                <p className="mobile-comment">{transaction.comment?.trim() || "내용 미기재"}</p>
                <div className="mobile-balance">거래 후 잔액 <strong>{formatWon(transaction.balanceAfter)}</strong></div>
                <div className="mobile-meta">
                  <span>{formatDate(transaction.date)}</span>
                  <span>{transaction.id}</span>
                </div>
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">⌕</span>
          <h3>{transactions.length === 0 ? "아직 등록된 거래내역이 없습니다." : "검색 결과가 없습니다."}</h3>
          <p>{transactions.length === 0 ? "새 거래가 생기면 내역을 업데이트하겠습니다." : "검색어나 필터 조건을 바꿔 다시 확인해 주세요."}</p>
          {transactions.length > 0 && <button type="button" className="reset-empty-button" onClick={resetFilters}>필터 초기화</button>}
        </div>
      )}
      <p className="ledger-note">※ 거래내역은 최신순으로 표시됩니다. 검색 결과는 현재 필터에 해당하는 거래만 포함합니다.</p>
    </section>
  );
}
