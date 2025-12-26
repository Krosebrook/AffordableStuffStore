#!/bin/bash

set -e

echo "🗄️  Seeding database..."

# Check if environment variables are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_KEY" ]; then
    echo "⚠️  Loading environment variables from .env file..."
    if [ -f .env ]; then
        export $(cat .env | grep -v '^#' | xargs)
    else
        echo "❌ .env file not found. Please create it from .env.example"
        exit 1
    fi
fi

# Extract database connection details
DB_HOST=$(echo $SUPABASE_URL | sed -n 's/.*https:\/\/\([^.]*\).*/\1/p')
DB_URL="db.${DB_HOST}.supabase.co"

echo "📋 Running schema..."
psql "postgresql://postgres:${SUPABASE_DB_PASSWORD}@${DB_URL}:5432/postgres" \
    -f pod-ai-app/database/schema.sql

echo "🔒 Applying RLS policies..."
psql "postgresql://postgres:${SUPABASE_DB_PASSWORD}@${DB_URL}:5432/postgres" \
    -f pod-ai-app/database/rls-policies.sql

echo "⚙️  Creating database functions..."
psql "postgresql://postgres:${SUPABASE_DB_PASSWORD}@${DB_URL}:5432/postgres" \
    -f pod-ai-app/database/functions.sql

# Ask if user wants to seed test data
read -p "Do you want to seed test data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding test data..."
    psql "postgresql://postgres:${SUPABASE_DB_PASSWORD}@${DB_URL}:5432/postgres" \
        -f pod-ai-app/database/seeds.sql
    echo "✅ Test data seeded"
fi

echo "✨ Database setup complete!"
