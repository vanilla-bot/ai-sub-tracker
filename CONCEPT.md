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

- **Runtime**: Python 3.11+ (minimal dependencies)
- **UI**: Terminal TUI via [Textual](https://github.com/Textualize/textual) — rich, keyboard-navigable interface
- **Data storage**: `config/plans.json` + `data/usage_log.json` (local JSON files, no database)
- **Config format**: Human-readable JSON (easy to edit by hand, no special tools needed)
- **Package manager**: uv (fast, modern Python tooling)
- **Testing**: pytest with pytest-cov

---

## 5. File Structure

```
ai-sub-tracker/
├── CONCEPT.md
├── README.md
├── pyproject.toml
├── uv.lock
├── src/
│   └── ai_sub_tracker/
│       ├── __init__.py
│       ├── cli.py          # Textual TUI entrypoint
│       ├── models.py       # Pydantic models (Plan, UsageEntry)
│       ├── store.py        # JSON file read/write
│       ├── screens/
│       │   ├── dashboard.py    # Main plan cards screen
│       │   ├── add_plan.py    # Add/edit form
│       │   ├── usage_log.py   # Usage history view
│       │   └── cost_summary.py
│       └── utils.py
├── config/
│   └── plans.json          # User's plan definitions (gitignored)
├── data/
│   └── usage_log.json      # Usage entries (gitignored)
└── tests/
    ├── test_models.py
    ├── test_store.py
    └── test_cli.py
```

---

## 6. Out of Scope (v1)

- Auto-fetching token balances from provider APIs
- Payment processing or subscription management
- Multi-user / cloud sync
- Non-coding plans (chat-only subscriptions)

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

- Should the app support **auto-discovery** of token usage via provider APIs (if any public ones exist)?
- Want a **web version** (FastAPI + HTMX) instead of or alongside the TUI?
- Any other providers to add beyond these four?
