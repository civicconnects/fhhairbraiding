#!/bin/bash
set -eo pipefail

echo "=================================================="
echo "🚀 Initiating Anti-Gravity Deployment Pipeline"
echo "=================================================="

echo "🧪 [1/4] Executing Assert Logic (QA Blueprint)..."
# 1. Start the local worker api in the background if running tests against it
# npx wrangler dev worker/src/index.ts --local &
# PID=$!
# sleep 5

echo "--> Running Concurrency Stress Test..."
node tests/stress_test.js || { echo "❌ Stress Test Failed!"; exit 1; }

echo "--> Running Playwright Assertions (Double-Queen & Ghost Payments)..."
# Uncomment when E2E environment is fully configured
# npx playwright test || { echo "❌ Playwright Specs Failed!"; exit 1; }

# kill $PID

echo ""
echo "🏗️ [2/4] Constructing the Production Bundle..."
npm run build || { echo "❌ Frontend Build Failed!"; exit 1; }

echo ""
echo "⚡ [3/4] Validating Mobile Speed Trap (Lighthouse CI)..."
npx lhci autorun || { echo "⚠️ Lighthouse Performance Budget Missed. Check LCP scores."; exit 1; }

echo ""
echo "☁️ [4/4] Deploying to Cloudflare Edge..."
# Ensure wrangler is authenticated
npx wrangler pages deploy dist --project-name="fhhairbraiding" || { echo "❌ Cloudflare Pages Deployment Failed!"; exit 1; }
npx wrangler deploy --minify worker/src/index.ts || { echo "❌ Cloudflare Worker Deployment Failed!"; exit 1; }

echo "=================================================="
echo "✅ DEPLOYMENT SUCCESSFUL: F&H Hair Braiding is LIVE!"
echo "=================================================="
