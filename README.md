# 프로미스나인 9주년 서포트 모금계좌 거래내역

Next.js + TypeScript 기반의 정적 공개 웹사이트입니다. 거래 내역은 `data/transactions.json`에서 관리하며, 방문자는 웹사이트에서 데이터를 수정할 수 없습니다. GitHub에 푸시하면 Vercel이 자동으로 새 버전을 배포하도록 구성할 수 있습니다.

## 요구 사항

- Node.js 20.9 이상 권장
- npm
- GitHub 계정 및 Vercel 계정(배포할 때)

## 로컬 실행

```bash
npm install
npm run validate:data
npm run dev
```

브라우저에서 `http://localhost:3000`을 여세요.

## 거래내역 추가 및 수정

`data/transactions.json` 파일을 수정합니다.

```json
{
  "version": 1,
  "currency": "KRW",
  "openingBalance": 0,
  "transactions": [
    {
      "id": "txn-0001",
      "date": "2026-10-14T14:30:00+09:00",
      "type": "deposit",
      "amount": 50000,
      "comment": "모금 입금"
    }
  ]
}
```

### 필드 설명

- `version`: 데이터 형식 버전입니다.
- `currency`: 현재 `KRW`만 지원합니다.
- `openingBalance`: 장부 시작 잔액입니다. 이번 프로젝트 설정은 0원입니다.
- `transactions`: 거래 배열입니다.
- `id`: 거래마다 고유해야 하는 ID입니다. 기존 거래 ID를 재사용하지 마세요.
- `date`: ISO 8601 형식의 날짜·시간입니다. 한국 시간은 `+09:00`을 붙이세요.
- `type`: `deposit`(입금) 또는 `withdrawal`(출금)입니다.
- `amount`: 양의 정수 금액(원)입니다. 출금도 양수로 입력하고 `type`으로 구분합니다.
- `comment`: 선택 사항입니다. 주석이 없으면 빈 문자열로 두거나 생략할 수 있습니다.

거래는 입력 순서와 무관하게 화면에서 최신순으로 표시됩니다. 통계는 `openingBalance + 입금 합계 - 출금 합계`로 계산합니다.

## 데이터 검증

JSON을 수정한 뒤 푸시하기 전에 아래 명령으로 확인하세요.

```bash
npm run validate:data
```

검증기는 JSON 파싱 오류, 중복 ID, 잘못된 날짜, 0 이하/정수가 아닌 금액, 잘못된 거래 유형 등을 검사합니다.

## Vercel 배포

1. 프로젝트를 GitHub 저장소에 푸시합니다.
2. Vercel에서 **Add New → Project**를 선택합니다.
3. GitHub 저장소를 가져옵니다.
4. Framework Preset은 Next.js, Build Command는 `npm run build`(기본값), Install Command는 `npm install`(기본값)로 둡니다.
5. 배포가 끝나면 공개 URL을 확인합니다.
6. 이후 `data/transactions.json`을 수정하고 GitHub에 푸시하면 자동으로 재배포됩니다.

## Windows PowerShell에서 GitHub에 최초 푸시

GitHub에서 빈 저장소를 먼저 만든 뒤, 저장소 URL을 아래 명령의 주소로 바꾸세요.

```powershell
git init
git add .
git commit -m "Initial fundraising ledger"
git branch -M main
git remote add origin https://github.com/사용자명/저장소명.git
git push -u origin main
```

이미 Git 저장소가 연결되어 있다면 `git init`과 `git remote add origin ...`은 다시 실행하지 마세요.

## 개인정보 및 투명성 주의

- 공개 주석에 입금자 실명, 전화번호, 계좌번호 등 개인정보를 기록하지 마세요.
- 은행 거래내역 원본을 그대로 공개하기보다 공개에 필요한 최소 정보만 기록하세요.
- Git 기록에는 과거 JSON이 남을 수 있습니다. 민감정보를 잘못 푸시했다면 파일에서 지우는 것만으로 과거 기록이 없어지지 않습니다.
- 실제 은행 잔액과 맞추려면 모든 입출금과 정정 내역을 빠짐없이 반영해야 합니다.
- 이 사이트는 장부 공개용이며 은행 계좌와 자동 연동되지 않습니다.

## 프로젝트 구조

```text
fundraising-ledger/
├── data/
│   └── transactions.json
├── scripts/
│   └── validate-transactions.ts
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── LedgerDashboard.tsx
│   └── lib/
│       └── ledger.ts
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
└── tsconfig.json
```
