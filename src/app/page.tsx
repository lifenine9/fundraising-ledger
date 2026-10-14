import LedgerDashboard from "@/components/LedgerDashboard";
import { calculateSummary, transactions } from "@/lib/ledger";

export default function Home() {
  const summary = calculateSummary();

  return (
    <main className="page-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="프로미스나인 9주년 서포트 모금계좌 거래내역 홈">
          <span className="brand-mark" aria-hidden="true">₩</span>
          <span>프로미스나인 9주년 서포트 모금계좌 거래내역</span>
        </a>
        <span className="public-label"><span className="status-dot" /> 거래내역</span>
      </header>

      <section className="intro">
        <h1>프로미스나인 9주년 서포트 모금계좌 거래내역</h1>
        <p className="intro-copy">
          모금 계좌의 입금과 출금 내역을 기록하고, 현재 잔액을 확인할 수 있습니다.
        </p>
      </section>

      <section className="summary-grid" aria-label="계좌 요약">
        <article className="summary-card balance-card">
          <p className="summary-label">현재 잔액</p>
          <p className="summary-value balance-value">{summary.balance.toLocaleString("ko-KR")}<span>원</span></p>
          <p className="summary-footnote">초기 잔액 0원 기준</p>
        </article>
        <article className="summary-card">
          <p className="summary-label"><span className="type-dot deposit-dot" /> 누적 입금액</p>
          <p className="summary-value deposit-value">{summary.depositTotal.toLocaleString("ko-KR")}<span>원</span></p>
          <p className="summary-footnote">총 입금 {transactions.filter((item) => item.type === "deposit").length}건</p>
        </article>
        <article className="summary-card">
          <p className="summary-label"><span className="type-dot withdrawal-dot" /> 누적 출금액</p>
          <p className="summary-value withdrawal-value">{summary.withdrawalTotal.toLocaleString("ko-KR")}<span>원</span></p>
          <p className="summary-footnote">총 출금 {transactions.filter((item) => item.type === "withdrawal").length}건</p>
        </article>
      </section>

      <LedgerDashboard transactions={transactions} />

      <footer className="site-footer">
        <p>본 페이지는 거래내역을 공개하기 위한 페이지이며, 은행 계좌와 자동으로 연동되지 않습니다.</p>
        <p>거래 내역은 확인 가능한 기록을 기준으로 업데이트됩니다.</p>
      </footer>
    </main>
  );
}
