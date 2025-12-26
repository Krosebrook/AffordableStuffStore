#!/bin/bash

set -e

echo "🚀 Setting up Pod AI App..."

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Aborting." >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed. Aborting." >&2; exit 1; }

echo "✅ Prerequisites check passed"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update .env file with your API keys"
fi

# Setup backend
echo "📦 Installing backend dependencies..."
cd pod-ai-app/backend
npm install
echo "✅ Backend dependencies installed"

# Setup mobile
echo "📦 Installing mobile dependencies..."
cd ../mobile
npm install
echo "✅ Mobile dependencies installed"

cd ../..

# Check if Docker is available
if command -v docker >/dev/null 2>&1; then
    echo "🐳 Docker is available"
    read -p "Do you want to set up with Docker? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🐳 Building Docker images..."
        docker-compose -f pod-ai-app/docker/docker-compose.yml build
        echo "✅ Docker images built"
    fi
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your API keys"
echo "2. Start the backend: cd pod-ai-app/backend && npm run dev"
echo "3. Start the mobile app: cd pod-ai-app/mobile && npm start"
echo "4. (Optional) Run with Docker: docker-compose -f pod-ai-app/docker/docker-compose.yml up"
echo ""
echo "📚 Documentation: pod-ai-app/docs/README.md"
