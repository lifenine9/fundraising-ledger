import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "프로미스나인 9주년 서포트 모금계좌 거래내역",
  description: "프로미스나인 9주년 서포트 모금계좌의 입출금 내역과 잔액을 확인할 수 있습니다.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
