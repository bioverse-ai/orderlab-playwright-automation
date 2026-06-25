# AI-Assisted QA Workflow

This project uses AI as a QA thinking assistant, not as a replacement for test
design judgment.

The goal of the workflow is to move from a feature requirement to a small,
risk-based automation set that is understandable in code review and in an
interview.

## Workflow

```text
Requirement
  → Product risk
  → Test scenarios
  → Automation candidates
  → Implemented tests
  → CI evidence
```

## Example: customer checkout

### Requirement

A customer can add a product to the cart, submit checkout details, and receive an
order confirmation.

### Product risks

- Checkout might create an order with missing customer details.
- Cart contents might not be included in the order.
- The order confirmation might not show a reliable order ID or status.
- The backend might calculate the wrong subtotal.

### Test scenarios

| Scenario | Level | Reason |
|---|---|---|
| Customer completes checkout successfully | UI | Verifies the real user journey |
| Empty checkout fields show validation errors | UI | Verifies user-facing validation |
| API creates an order with expected subtotal | API | Verifies server-side pricing |
| API rejects unknown product ID | API | Verifies invalid payload handling |
| Order response matches expected contract | API | Verifies important response shape |

### Automation choices

- UI tests cover what the user sees and does.
- API tests cover backend behavior faster and more directly.
- Page Objects keep UI actions readable.
- API clients keep HTTP details out of scenario-level tests.
- Shared test data keeps seeded demo values in one place.

### Implemented evidence

- `tests/ui/checkout.spec.ts`
- `tests/api/orders.spec.ts`
- `tests/support/api/ordersApi.ts`
- `tests/support/contracts.ts`
- GitHub Actions HTML report artifact

## Example: admin order status

### Requirement

An admin can view customer orders and update an order status.

### Product risks

- Admin might not see newly created customer orders.
- Status updates might not persist after reload.
- Customer and admin flows might accidentally share browser state.

### Test scenarios

| Scenario | Level | Reason |
|---|---|---|
| Customer creates an order, admin updates status | UI | Verifies cross-role workflow |
| Status remains after reload | UI | Verifies persistence |

### Automation choices

- The test uses separate customer/admin authenticated pages.
- The order is created during the test run instead of relying on old data.
- The admin page reloads before checking the order to avoid stale list state.

### Implemented evidence

- `tests/ui/admin-orders.spec.ts`
- `tests/fixtures.ts`
- `tests/pages/AdminOrdersPage.ts`

## How AI fits into this process

AI can help with:

- brainstorming risks;
- turning requirements into test ideas;
- reviewing whether coverage is too happy-path heavy;
- drafting Page Objects and helpers;
- spotting duplication;
- improving documentation.

Human review is still required for:

- deciding what risk matters;
- choosing what not to automate;
- validating selectors and test data;
- checking whether a test is stable;
- explaining trade-offs in an interview.

## Guardrails

- Do not add tests only to increase the count.
- Do not hide flaky behavior behind retries.
- Do not use brittle selectors when accessible locators or `data-testid` exist.
- Do not commit real secrets, real customer data, or production credentials.
- Keep the framework small enough to explain.

## Current improvement backlog

| Improvement | Why it matters |
|---|---|
| API auth without browser storage | Makes API tests more independent from UI login |
| Test data reset/seed endpoint | Makes every run start from a known state |
| More malformed payload API checks | Improves negative coverage |
| Accessibility smoke checks | Adds user-centered quality signal |
