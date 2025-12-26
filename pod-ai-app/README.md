# Pod AI App

A mobile application for creating AI-generated print-on-demand merchandise. Generate custom designs using AI, customize products, and order directly from your phone.

## Features

- 🎨 **AI Image Generation** - Create unique designs with AI
- 🛍️ **Print-on-Demand** - Order custom merchandise powered by Printful
- 💳 **Secure Payments** - Process payments with Stripe
- 📱 **Cross-Platform** - iOS and Android support
- 👤 **User Profiles** - Manage your designs and orders
- 📦 **Order Tracking** - Track your orders from creation to delivery

## Project Structure

This is a monorepo containing:

- **mobile/** - React Native + Expo mobile application
- **backend/** - Express API server
- **database/** - Supabase database schemas and migrations
- **docs/** - Comprehensive documentation
- **docker/** - Docker configuration for deployment
- **scripts/** - Automation scripts

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- Docker (optional, for containerized deployment)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd AffordableStuffStore
```

2. Run the setup script:
```bash
./pod-ai-app/scripts/setup.sh
```

3. Configure environment variables:
```bash
cp pod-ai-app/.env.example pod-ai-app/.env
# Edit .env with your API keys
```

4. Start the backend:
```bash
cd pod-ai-app/backend
npm run dev
```

5. Start the mobile app (in a new terminal):
```bash
cd pod-ai-app/mobile
npm start
```

## Documentation

- [Main Documentation](pod-ai-app/docs/README.md)
- [API Documentation](pod-ai-app/docs/API.md)
- [Architecture](pod-ai-app/docs/ARCHITECTURE.md)
- [Deployment Guide](pod-ai-app/docs/DEPLOYMENT.md)

## Tech Stack

### Mobile App
- React Native
- Expo & Expo Router
- Zustand (state management)
- Supabase (auth & database)

### Backend
- Node.js & Express
- TypeScript
- Supabase
- Stripe API
- Printful API

### Infrastructure
- Docker & Docker Compose
- Nginx
- GitHub Actions

## Development

### Backend Development

```bash
cd pod-ai-app/backend
npm run dev          # Start development server
npm run build        # Build TypeScript
npm test             # Run tests
npm run lint         # Lint code
```

### Mobile Development

```bash
cd pod-ai-app/mobile
npm start            # Start Expo
npm run android      # Run on Android
npm run ios          # Run on iOS
npm test             # Run tests
```

## Deployment

### Using Docker

```bash
./pod-ai-app/scripts/deploy.sh docker
```

### Manual Deployment

```bash
./pod-ai-app/scripts/deploy.sh manual
```

See [Deployment Guide](pod-ai-app/docs/DEPLOYMENT.md) for detailed instructions.

## Database Setup

Initialize the database with:

```bash
./pod-ai-app/scripts/seed-db.sh
```

This will:
- Create database schema
- Apply Row Level Security policies
- Create database functions
- Optionally seed test data

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## API Keys Required

- **Supabase**: For database and authentication
- **Stripe**: For payment processing
- **Printful**: For print-on-demand fulfillment
- **OpenAI or Stable Diffusion**: For AI image generation

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Backend
SUPABASE_URL=your-supabase-url
STRIPE_SECRET_KEY=your-stripe-key
PRINTFUL_API_KEY=your-printful-key
OPENAI_API_KEY=your-openai-key

# Mobile
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
```

## Testing

Run tests for all components:

```bash
# Backend tests
cd pod-ai-app/backend && npm test

# Mobile tests
cd pod-ai-app/mobile && npm test
```

## License

MIT License - see [LICENSE](LICENSE) file for details

## Support

For issues and questions:
- Check the [documentation](pod-ai-app/docs/)
- Open an issue on GitHub
- Contact the development team

## Acknowledgments

- Built with React Native and Expo
- Powered by Supabase
- Payment processing by Stripe
- Print-on-demand by Printful
- AI generation with OpenAI

---

Made with ❤️ by the Pod AI Team
