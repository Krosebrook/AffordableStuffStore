#!/bin/bash

set -e

echo "🚀 Deploying Pod AI App..."

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "❌ .env file not found"
    exit 1
fi

# Check deployment target
DEPLOY_TARGET=${1:-docker}

case $DEPLOY_TARGET in
    docker)
        echo "🐳 Deploying with Docker Compose..."
        
        # Build images
        echo "📦 Building Docker images..."
        docker-compose -f pod-ai-app/docker/docker-compose.yml build
        
        # Stop existing containers
        echo "🛑 Stopping existing containers..."
        docker-compose -f pod-ai-app/docker/docker-compose.yml down
        
        # Start new containers
        echo "▶️  Starting new containers..."
        docker-compose -f pod-ai-app/docker/docker-compose.yml up -d
        
        # Wait for services to be healthy
        echo "⏳ Waiting for services to be ready..."
        sleep 10
        
        # Check health
        echo "🏥 Checking service health..."
        curl -f http://localhost:3000/health || { echo "❌ Backend health check failed"; exit 1; }
        
        echo "✅ Deployment successful!"
        ;;
        
    manual)
        echo "📦 Deploying manually..."
        
        # Build backend
        echo "🔨 Building backend..."
        cd pod-ai-app/backend
        npm install --production
        npm run build
        
        # Restart backend service (using PM2 as example)
        echo "♻️  Restarting backend service..."
        pm2 restart pod-ai-backend || pm2 start dist/index.js --name pod-ai-backend
        
        cd ../..
        
        echo "✅ Backend deployed!"
        
        # Build mobile app
        echo "📱 Building mobile apps..."
        cd pod-ai-app/mobile
        
        echo "Building for iOS..."
        eas build --platform ios --non-interactive
        
        echo "Building for Android..."
        eas build --platform android --non-interactive
        
        cd ../..
        
        echo "✅ Mobile apps built!"
        ;;
        
    *)
        echo "❌ Unknown deployment target: $DEPLOY_TARGET"
        echo "Usage: $0 [docker|manual]"
        exit 1
        ;;
esac

echo ""
echo "✨ Deployment complete!"
echo ""
echo "Services:"
echo "- Backend API: http://localhost:3000"
echo "- Health check: http://localhost:3000/health"
