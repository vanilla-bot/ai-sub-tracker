# AI Coding Plan Tracker — Concept

> **Funnel app for managing AI coding subscriptions across providers, with token budgets, usage periods, and pricing at a glance.**

---

## 1. Vision

A lightweight dashboard for power users who juggle multiple AI coding plan subscriptions (Cloud Code, Codex, GLM, MiniMax). Instead of logging into four different portals, users get one unified view showing what they have, what they've used, what's renewing, and how much it's costing them. The goal is **cost transparency and usage awareness** — so you never get surprised by a bill or run dry mid-sprint.

---

## 2. Providers & Plan Snapshot

| Provider | Code Product | Token Budget | Period | Price (est.) | Renewal |
|---|---|---|---|---|---|
| **Cloud Code** | Cloud Code (by provider) | — / — | monthly | — | — |
| **Codex** | OpenAI Codex CLI | — / — | monthly | — | — |
| **GLM** | Zhipu AI Coding Plan (glm-5.1) | — / — | monthly | — | — |
| **MiniMax** | MiniMax Coding (MiniMax-Text-01) | — / — | monthly | — | — |

> Budgets, prices, and renewal dates are user-configured. The app stores and displays them — it does **not** auto-fetch from provider APIs (those APIs are either paid, undocumented, or rate-limited).

---

## 3. Core Features

### 3.1 Plan Dashboard
- One screen listing all four providers as cards.
- Each card shows: provider name, plan name, token budget (used / total), period, price, next renewal date.
- Color-coded status: 🟢 healthy (>50% remaining), 🟡 low (10–50%), 🔴 critical (<10% or over budget).

### 3.2 Add / Edit Plan
- Form fields: Provider, Plan Name, Token Budget (total), Period (monthly / quarterly / yearly), Price, Renewal Date.
- Stored locally in a config file (`config/plans.json`) — no backend required.

### 3.3 Usage Log
- Manual entry for token usage: date, provider, tokens used.
- Running tally per provider against the configured budget.
- View history per provider.

### 3.4 Cost Summary
- Monthly total across all active plans.
- Optional: projected monthly spend based on configured prices.

### 3.5 Notifications / Alerts (future)
- When a plan drops below a threshold (e.g. 20% tokens remaining).
- Can be wired to Telegram, email, or a webhook.

---

## 4. Tech Stack

- **Language**: TypeScript (strict mode)
- **Runtime**: Node.js 20+
- **TUI Framework**: [Ink](https://github.com/vadimdemedes/ink) — React for CLIs, excellent TS support, used by AWS CDK, Prisma, GitHub CLI, Vercel
- **Package Manager**: npm (with `package-lock.json`)
- **Data Storage**: `config/plans.json` + `data/usage_log.json` (local JSON files, no database)
- **Testing**: Vitest

> **Why Ink over alternatives?**
> - React for CLIs — if you know React, you already know Ink
> - Most reviewed/modified TUI lib for TypeScript
> - Large ecosystem, actively maintained
> - Easy to add components and screens

---

## 5. File Structure

```
ai-sub-tracker/
├── CONCEPT.md
├── README.md
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vitest.config.ts
├── src/
│   ├── index.ts           # CLI entrypoint (inklecat / node --loader)
│   ├── app.ts             # Root Ink <App> component
│   ├── components/
│   │   ├── Dashboard.tsx      # Main plan cards screen
│   │   ├── PlanCard.tsx        # Individual provider card
│   │   ├── AddPlanForm.tsx     # Add/edit form
│   │   ├── UsageLogView.tsx    # Usage history view
│   │   └── CostSummary.tsx
│   ├── models/
│   │   └── plan.ts        # Plan, UsageEntry, PlanPeriod types
│   ├── store/
│   │   └── fileStore.ts   # JSON file read/write
│   └── utils/
│       └── helpers.ts
├── config/
│   └── plans.json          # User's plan definitions (gitignored)
├── data/
│   └── usage_log.json      # Usage entries (gitignored)
└── tests/
    ├── plan.test.ts
    └── fileStore.test.ts
```

---

## 6. Out of Scope (v1)

- Auto-fetching token balances from provider APIs
- Payment processing or subscription management
- Multi-user / cloud sync
- Non-coding plans (chat-only subscriptions)
- Web UI (TUI only for v1)

---

## 7. Success Criteria

1. User can add four plans (Cloud Code, Codex, GLM, MiniMax) with token budget, price, and renewal date.
2. Dashboard displays all four plans with status colors.
3. User can log token usage and see remaining balance.
4. Monthly cost summary is displayed.
5. Config lives in `config/plans.json` — no backend, fully local.
6. TUI runs in terminal with keyboard navigation.

---

## 8. Open Questions

- Want a **web version** (FastAPI + HTMX) instead of or alongside the TUI?
- Should the app support **auto-discovery** of token usage via provider APIs (if any public ones exist)?
- Any other providers to add beyond these four?
- CLI invocation style: `ai-sub-tracker` (global install) or `npx ai-sub-tracker`?
