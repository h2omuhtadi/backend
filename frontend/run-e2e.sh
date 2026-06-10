#!/usr/bin/env bash
# Helper script to run E2E locally against a running backend and frontend
# Usage: ./run-e2e.sh

set -e

echo "Starting E2E test against http://localhost:5173"

echo "Make sure frontend (npm run dev) and backend (http://localhost:8080) are running"

npx playwright test --project=chromium
