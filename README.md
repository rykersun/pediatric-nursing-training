# 小兒注射護理訓練 Pediatric Injection Training

護理學生專用的小兒注射溝通與技術訓練平台。

A pediatric injection training platform for nursing students, built with Next.js, TypeScript, and Tailwind CSS.

## 學習旅程 Learning Journey

1. 課程介紹 Course Introduction
2. 虛擬人：注射前與母親溝通 Virtual Human: Mother Before Injection
3. 虛擬人：安撫與溝通幼兒 Virtual Human: Calm the Child
4. 360 度互動注射情境 360° Interactive Injection Scenario
5. 虛擬人：注射後與母親溝通 Virtual Human: Mother After Injection
6. 成果與回饋 Results and Feedback

## 路由 Route Map

| Path | Description |
| --- | --- |
| `/` | Landing page with course overview |
| `/journey` | Course overview with step cards and live status |
| `/journey/step/[step]` | Individual learning steps (1–5) |
| `/journey/results` | Session summary and feedback |

## 技術棧 Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4

## 本地開發 Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 建置 Build

```bash
npm run build
```

## 注意 Notes

- 此版本為可點擊的第一版，使用 mock data 與 placeholder 內容，未來將串接 Virti 互動模組。
- 學習進度儲存在瀏覽器 localStorage，無後端、無資料庫、無身份驗證。
