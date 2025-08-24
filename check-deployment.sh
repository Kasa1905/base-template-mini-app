#!/bin/bash

echo "🚀 ProofVault Deployment Readiness Checker"
echo "==========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the project directory?"
    exit 1
fi

echo "✅ Project directory confirmed"

# Check if vercel.json exists
if [ -f "vercel.json" ]; then
    echo "✅ vercel.json configuration ready"
else
    echo "❌ vercel.json missing"
fi

# Check if next.config.ts exists
if [ -f "next.config.ts" ]; then
    echo "✅ Next.js configuration ready"
else
    echo "❌ next.config.ts missing"
fi

# Check if package.json has correct build script
if grep -q '"build": "next build"' package.json; then
    echo "✅ Build script configured for Vercel"
else
    echo "⚠️  Build script might need adjustment"
fi

# Check if node_modules exists (dependencies installed)
if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed"
else
    echo "⚠️  Dependencies not installed (run: npm install)"
fi

# Check git status
if git status >/dev/null 2>&1; then
    if [ -z "$(git status --porcelain)" ]; then
        echo "✅ All changes committed"
        
        # Check if we have a remote
        if git remote get-url origin >/dev/null 2>&1; then
            echo "✅ Git remote configured"
            echo "📍 Remote URL: $(git remote get-url origin)"
        else
            echo "❌ Git remote not configured"
        fi
    else
        echo "⚠️  Uncommitted changes detected"
        echo "📝 Uncommitted files:"
        git status --porcelain
    fi
else
    echo "❌ Not a git repository"
fi

echo ""
echo "🎯 Deployment Status:"
echo "===================="

# Count ready checks
ready_count=0
total_checks=5

[ -f "vercel.json" ] && ready_count=$((ready_count + 1))
[ -f "next.config.ts" ] && ready_count=$((ready_count + 1))
grep -q '"build": "next build"' package.json && ready_count=$((ready_count + 1))
[ -d "node_modules" ] && ready_count=$((ready_count + 1))
[ -z "$(git status --porcelain 2>/dev/null)" ] && ready_count=$((ready_count + 1))

if [ $ready_count -eq $total_checks ]; then
    echo "🎉 READY TO DEPLOY! ($ready_count/$total_checks checks passed)"
    echo ""
    echo "🚀 Next steps:"
    echo "1. Go to https://vercel.com"
    echo "2. Sign up with GitHub"
    echo "3. Import your repository"
    echo "4. Click Deploy!"
    echo ""
    echo "📱 Your app will be live in 2-3 minutes!"
else
    echo "⚠️  Almost ready ($ready_count/$total_checks checks passed)"
    echo "Please fix the issues above before deploying."
fi

echo ""
echo "💡 Need help? Check DEPLOYMENT_GUIDE.md for detailed instructions!"
