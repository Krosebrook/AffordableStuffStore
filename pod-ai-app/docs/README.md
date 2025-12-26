# Pod AI App

A mobile application for AI-powered print-on-demand merchandise creation.

## Project Structure

```
pod-ai-app/
├── mobile/          # React Native + Expo mobile app
├── backend/         # Express API server
├── database/        # Supabase database configuration
├── docs/            # Documentation
├── docker/          # Docker configuration
└── scripts/         # Automation scripts
```

## Prerequisites

- Node.js 18+ and npm
- Expo CLI
- Docker and Docker Compose (optional)
- Supabase account
- Stripe account
- Printful account

## Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd pod-ai-app
```

### 2. Run setup script

```bash
./scripts/setup.sh
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

### 4. Start the backend

```bash
cd backend
npm install
npm run dev
```

### 5. Start the mobile app

```bash
cd mobile
npm install
npm start
```

## Features

- 🎨 AI-powered image generation
- 🛍️ Print-on-demand product creation
- 💳 Secure payment processing with Stripe
- 📦 Order management
- 👤 User authentication and profiles
- 📱 Cross-platform mobile app (iOS/Android)

## Documentation

- [API Documentation](docs/API.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## Tech Stack

### Mobile
- React Native
- Expo
- Expo Router
- Zustand (state management)
- Supabase (authentication & database)

### Backend
- Node.js
- Express
- TypeScript
- Supabase (database)
- Stripe (payments)
- Printful (print-on-demand)

### Infrastructure
- Docker
- Nginx
- GitHub Actions (CI/CD)

## License

MIT
