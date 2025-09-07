#!/bin/bash

echo "🚀 BaddBeatz Development Setup"
echo "=============================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python first."
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from example..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your configuration"
else
    echo "✅ .env file already exists"
fi

cd ..

# Create missing PWA icon if needed
if [ ! -f assets/images/icon-144x144.png ]; then
    echo "🎨 Creating PWA icon..."
    cp assets/images/Logo.png assets/images/icon-144x144.png
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start development:"
echo "1. Terminal 1: cd backend && npm install && node auth-server.js"
echo "2. Terminal 2: python server.py"
echo "3. Open http://localhost:8000 in your browser"
echo ""
echo "For production deployment, see HTTPS_DEPLOYMENT_GUIDE.md"
