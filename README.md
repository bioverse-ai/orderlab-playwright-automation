# OrderLab Playwright Automation

[![Playwright CI](https://github.com/bioverse-ai/orderlab-playwright-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/bioverse-ai/orderlab-playwright-automation/actions/workflows/playwright.yml)

Public SDET / QA Automation portfolio project for the
[OrderLab Demo](https://orderlab-playwright-target.lovable.app) application.

The goal is to show a small but realistic automation framework: Playwright,
TypeScript, Page Object Model, UI tests, API tests, CI, HTML reporting, and
failure artifacts.

Repository: <https://github.com/bioverse-ai/orderlab-playwright-automation>
CI workflow: <https://github.com/bioverse-ai/orderlab-playwright-automation/actions/workflows/playwright.yml>

## Application under test

- Public app: <https://orderlab-playwright-target.lovable.app>
- Public API base: <https://orderlab-playwright-target.lovable.app/api/public>
- Demo customer: `customer@example.com / CustomerDemo123!`
- Demo admin: `admin@example.com / AdminDemo123!`

These are public demo fixtures, not real credentials. The app contains no real
customer data, payment processing, or production business logic.

## Tech stack

- Playwright Test
- TypeScript
- npm
- GitHub Actions
- Playwright HTML report, screenshots, and traces

## Current test coverage

### UI scenarios

| Scenario | File |
|---|---|
| Login form renders | `tests/ui/login.spec.ts` |
| Invalid login displays an error | `tests/ui/login.spec.ts` |
| Customer logs in successfully | `tests/ui/login.spec.ts` |
| Customer searches and filters products | `tests/ui/products.spec.ts` |
| Customer adds a product to the cart | `tests/ui/cart.spec.ts` |
| Customer completes checkout and sees confirmation | `tests/ui/checkout.spec.ts` |
| Admin updates a created order status | `tests/ui/admin-orders.spec.ts` |

### API scenarios

| Scenario | File |
|---|---|
| Read product catalog | `tests/api/products.spec.ts` |
| Create an order | `tests/api/orders.spec.ts` |
| Read a created order by ID | `tests/api/orders.spec.ts` |

## Project structure

```text
tests/
  api/        API tests for public OrderLab endpoints
  pages/      Page Objects for UI screens
  support/    Small shared helpers
  ui/         UI tests
```

## Local setup

Requirements:

- Node.js 20+
- npm

Install dependencies and Playwright Chromium:

```bash
npm install
npx playwright install chromium
cp .env.example .env
```

Run checks:

```bash
npm run typecheck
npm test
```

Useful targeted commands:

```bash
npm run test:smoke
npm run test:regression
npm run test:ui
npm run test:api
npm run test:headed
```

Open the last HTML report:

```bash
npm run report
```

## Environment variables

The framework reads configuration from environment variables. For local runs,
copy `.env.example` to `.env`.

```env
BASE_URL=https://orderlab-playwright-target.lovable.app
API_BASE_URL=https://orderlab-playwright-target.lovable.app/api/public
CUSTOMER_EMAIL=customer@example.com
CUSTOMER_PASSWORD=CustomerDemo123!
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=AdminDemo123!
```

`.env` is ignored by Git. The committed `.env.example` uses only public demo
fixtures.

## CI

GitHub Actions workflow:

```text
.github/workflows/playwright.yml
```

The pipeline runs on push and pull request:

1. Check out the repository.
2. Install Node.js 20.
3. Run `npm ci`.
4. Install Playwright Chromium.
5. Run `npm run typecheck`.
6. Run `npm test`.
7. Upload `playwright-report/` and `test-results/` artifacts.

CI keeps Playwright traces in the HTML report so reviewers can inspect test
execution from the GitHub Actions artifact.

## Design notes

- Page Objects are small and screen-focused.
- Locators prefer roles, labels, and stable `data-testid` attributes.
- Tests avoid fixed sleeps and use Playwright web-first assertions.
- Each order-related test creates its own order data.
- Public API routes are under `/api/public/*`, but protected order routes still
  require bearer authentication.
- API order tests obtain a customer bearer token through the public demo login
  flow, then call the HTTP API directly.
- CI enables Playwright traces for the portfolio report artifact; local runs use
  lighter retry-only traces.
