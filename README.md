# AI Subscription Tracker

A terminal-based CLI application for tracking AI service subscriptions and usage across multiple providers.

## Features

- **Dashboard View** — Overview of all active subscriptions with usage statistics
- **Add Plans** — Register new AI service subscriptions with pricing and token limits
- **Usage Logging** — Track token consumption per plan and billing period
- **Cost Summary** — View aggregated costs and usage breakdown by provider
- **Multi-Provider Support** — Manage subscriptions across different AI services

## Supported Providers

| Provider | Service |
|----------|---------|
| `cloud_code` | Cloud Code |
| `codex` | Codex |
| `glm` | GLM (Zhipu AI) |
| `minimax` | MiniMax |

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ai-sub-tracker

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

### Usage

```bash
# Run the tracker
node dist/index.js

# Or install globally
npm install -g
ai-sub-tracker
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `D` | Dashboard — view all plans and usage |
| `A` | Add Plan — register a new subscription |
| `U` | Usage Log — log token usage for a plan |
| `C` | Cost Summary — view cost breakdown |
| `Q` | Quit — exit the application |

## Configuration

Data is stored in JSON files under `./data/`:

- `plans.json` — subscription plan definitions
- `usage.json` — token usage entries

Override default paths via CLI arguments:

```bash
node dist/index.js --plans-file ./custom/plans.json --usage-file ./custom/usage.json
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Ink](https://github.com/vadimdemedes/ink) — React for CLIs |
| UI | [React](https://react.dev/) 18 |
| Language | [TypeScript](https://www.typescriptlang.org/) 5 |
| Build | [tsc](https://www.typescriptlang.org/docs/handbook/compiler-options.html) |
| Testing | [Vitest](https://vitest.dev/) |
| CLI Parsing | [Meow](https://github.com/sinderedar/meow) |

## License

ISC
