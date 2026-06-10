## Tests

Run unit tests:

cd frontend
npm run test

Playwright E2E (skeleton):

- Install Playwright dependencies: npx playwright install
- Run: npx playwright test

CI: GitHub Actions workflow is configured at frontend/.github/workflows/ci.yml to run tests and build on push.
