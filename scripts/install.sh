#!/bin/bash

# Script to install dependencies with the preferred package manager

echo "🚀 Mind Heavenly - Dependency Installation"
echo "==========================================="

# Check if pnpm is available
if command -v pnpm &> /dev/null; then
    echo "✅ Found pnpm - using as package manager"
    pnpm install
elif command -v npm &> /dev/null; then
    echo "⚠️  pnpm not found, falling back to npm"
    echo "💡 For better performance, install pnpm: npm install -g pnpm"
    npm install
else
    echo "❌ Neither pnpm nor npm found. Please install Node.js first."
    exit 1
fi

echo ""
echo "🎉 Dependencies installed successfully!"
echo ""
echo "Next steps:"
echo "1. Set up Supabase: npx supabase start"
echo "2. Copy .env.template to .env.local and configure"
echo "3. Run migrations: npx supabase db reset"
echo "4. Seed database: pnpm run db:seed (or npm run db:seed)"
echo "5. Start development: pnpm run dev (or npm run dev)"
