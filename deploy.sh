#!/bin/bash

# FinLearn Deployment Script for Vercel
echo "🏔️ Deploying FinLearn to Vercel..."

# Kill any running processes
echo "📡 Stopping development servers..."
pkill -f "ts-node|nodemon|vite" 2>/dev/null || true

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build shared package
echo "🔧 Building shared package..."
cd shared && npm run build && cd ..

# Build frontend
echo "🎨 Building frontend..."
cd frontend && npm run build && cd ..

# Build backend
echo "⚙️ Building backend..."
cd backend && npm run build && cd ..

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
npx vercel --prod

echo "✅ Deployment complete!"
echo "🌍 Your FinLearn app should be live on Vercel!" 