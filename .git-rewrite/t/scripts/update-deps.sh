#!/bin/bash

# Timonacore Dependency Update Script
# This script updates all dependencies to their latest versions

set -e

echo "🔄 Updating Timonacore dependencies to latest versions..."

# Check if Bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ Bun is not installed. Please install Bun first:"
    echo "curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

echo "📦 Updating root dependencies..."
bun update

echo "📦 Updating backend dependencies..."
cd backend && bun update && cd ..

echo "📦 Updating frontend dependencies..."
cd frontend && bun update && cd ..

echo "🧹 Cleaning up old lockfiles..."
rm -f bun.lockb backend/bun.lockb frontend/bun.lockb

echo "📦 Reinstalling dependencies..."
bun install
cd backend && bun install && cd ..
cd frontend && bun install && cd ..

echo "🔍 Checking for outdated packages..."
echo "Root project:"
bun outdated

echo "Backend project:"
cd backend && bun outdated && cd ..

echo "Frontend project:"
cd frontend && bun outdated && cd ..

echo "✅ Dependency update complete!"
echo ""
echo "Next steps:"
echo "1. Test the application: bun run dev"
echo "2. Run tests: bun run test"
echo "3. Update CHANGELOG.md with new versions"
echo "4. Commit changes: git add . && git commit -m 'chore: update dependencies'"
echo ""
