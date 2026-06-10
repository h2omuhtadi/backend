# PR body to use when opening the final pull request

Title: feat(frontend): complete frontend - products, cart, checkout, orders, admin, tests & CI

Summary:
- Complete React + TypeScript frontend under frontend/ implementing:
  - Auth (register/login) with AuthContext and protected routes
  - Product listing, detail, admin create/delete
  - Cart (add, update qty, remove)
  - Address management (list + add)
  - Checkout (address picker → POST /api/orders/checkout)
  - Orders (list & detail) and Admin Orders (list, complete, cancel)
  - Payment simulation (frontend simulates payment if backend /payments not present)
  - Client-side validation (react-hook-form), validation mapping from backend
  - Unit tests (Vitest) and Playwright E2E skeleton + critical-path test
  - CI workflow running tests and build

How to test locally:
1. Backend: run the Spring Boot backend at http://localhost:8080
2. Frontend:
   - git fetch && git checkout frontend/cart-orders
   - cd frontend
   - npm ci
   - cp .env.example .env (set VITE_API_BASE_URL if needed)
   - npm run dev
3. Run unit tests:
   - cd frontend && npm run test
4. Run E2E locally (requires Playwright install and running backend + frontend):
   - cd frontend
   - npx playwright install
   - ./run-e2e.sh

Notes & Backend adjustments (if needed):
- CORS: ensure backend allows requests from the frontend origin (http://localhost:5173)
- Order items: the frontend expects GET /api/orders/{id} to return order with `items` array; if not present, consider returning line items in OrderResponse
- Auth: currently frontend uses localStorage token and Authorization header. For stronger security, consider switching to HttpOnly cookie authentication (backend changes required)

Testing checklist:
- [ ] Register + Login works and stores token
- [ ] Product list & detail load
- [ ] Add to cart, update qty, remove item
- [ ] Add address and select it at checkout
- [ ] Place order and view order in /orders
- [ ] Pay for order (simulated if backend /payments not present)
- [ ] Admin: create/delete products, list & complete/cancel orders
- [ ] Unit tests pass and CI builds succeed

