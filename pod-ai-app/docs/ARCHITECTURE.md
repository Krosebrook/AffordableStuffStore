# Architecture Documentation

## System Overview

Pod AI App is a mobile-first application for creating and ordering AI-generated print-on-demand merchandise. The system consists of three main components:

1. **Mobile App** - React Native + Expo
2. **Backend API** - Express + Node.js
3. **Database** - Supabase (PostgreSQL)

## Architecture Diagram

```
┌─────────────────┐
│   Mobile App    │
│  (React Native) │
└────────┬────────┘
         │
         ├─────── Supabase Auth
         │
         ├─────── Supabase Storage
         │
         ▼
┌─────────────────┐
│   Backend API   │
│    (Express)    │
└────────┬────────┘
         │
         ├────── Supabase DB
         │
         ├────── Stripe API
         │
         ├────── Printful API
         │
         └────── AI Service (OpenAI/etc)
```

## Components

### Mobile Application

**Technology Stack:**
- React Native 0.74
- Expo 51
- Expo Router (file-based routing)
- Zustand (state management)
- Supabase JS Client

**Directory Structure:**
```
mobile/
├── app/
│   ├── (auth)/          # Authentication screens
│   ├── (tabs)/          # Main app tabs
│   └── _layout.tsx      # Root layout
├── components/          # Reusable UI components
├── lib/                 # Utilities and services
│   ├── supabase.ts     # Supabase client
│   ├── api.ts          # API client
│   └── storage.ts      # Local storage
├── store/              # Zustand stores
└── types/              # TypeScript types
```

**Key Features:**
- File-based routing with Expo Router
- Authentication flow (login/signup)
- Image generation interface
- Product customization
- Order management
- Profile settings

### Backend API

**Technology Stack:**
- Node.js 20+
- Express 4
- TypeScript
- Supabase Client
- Stripe SDK
- Axios (for external APIs)

**Directory Structure:**
```
backend/
├── src/
│   ├── routes/          # API route handlers
│   │   ├── auth.ts
│   │   ├── images.ts
│   │   ├── orders.ts
│   │   └── payments.ts
│   ├── services/        # Business logic
│   │   ├── aiService.ts
│   │   ├── printfulService.ts
│   │   └── stripeService.ts
│   ├── middleware/      # Express middleware
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   └── rateLimiter.ts
│   ├── db/              # Database client
│   │   ├── client.ts
│   │   └── migrations/
│   ├── utils/           # Utility functions
│   └── index.ts         # Entry point
└── tests/               # Test suites
```

**API Design:**
- RESTful endpoints
- JWT authentication
- Request validation
- Rate limiting
- Error handling middleware

### Database

**Technology:** Supabase (PostgreSQL 15)

**Schema Overview:**

```sql
users
  ├── id (UUID, PK)
  ├── email (unique)
  ├── password_hash
  └── name

images
  ├── id (UUID, PK)
  ├── user_id (FK -> users)
  ├── prompt
  ├── image_url
  └── status

products
  ├── id (UUID, PK)
  ├── user_id (FK -> users)
  ├── image_id (FK -> images)
  ├── printful_product_id
  ├── name
  ├── price
  └── status

orders
  ├── id (UUID, PK)
  ├── user_id (FK -> users)
  ├── printful_order_id
  ├── status
  ├── total_amount
  └── shipping_address (JSONB)

order_items
  ├── id (UUID, PK)
  ├── order_id (FK -> orders)
  ├── product_id (FK -> products)
  ├── quantity
  └── price

payments
  ├── id (UUID, PK)
  ├── order_id (FK -> orders)
  ├── stripe_payment_intent_id
  ├── amount
  └── status
```

**Security:**
- Row Level Security (RLS) policies
- User data isolation
- Secure authentication with JWT

## Data Flow

### Image Generation Flow

1. User enters prompt in mobile app
2. Request sent to `/api/images/generate`
3. Backend validates request
4. AI service generates image
5. Image uploaded to Supabase Storage
6. Database record created
7. Response returned to mobile app

### Order Creation Flow

1. User selects product and customization
2. Request sent to `/api/orders`
3. Backend validates order data
4. Printful order created
5. Stripe payment intent created
6. Database records created
7. Response returned with payment intent
8. Mobile app processes payment
9. Webhook confirms payment
10. Order status updated

## External Services

### Supabase
- **Purpose:** Database, authentication, file storage
- **Integration:** Direct client in mobile, service key in backend
- **Features Used:** PostgreSQL, Auth, Storage, RLS

### Stripe
- **Purpose:** Payment processing
- **Integration:** Backend only
- **Flow:** Payment Intents API with webhooks

### Printful
- **Purpose:** Print-on-demand fulfillment
- **Integration:** Backend service
- **Features:** Product creation, order placement, shipping

### AI Service (OpenAI/Stable Diffusion)
- **Purpose:** Image generation
- **Integration:** Backend service
- **API:** REST API with async processing

## Security

### Authentication
- JWT tokens for API authentication
- Supabase Auth for user management
- Token refresh mechanism
- Secure password hashing (bcrypt)

### Authorization
- Row Level Security in database
- Middleware-based route protection
- Role-based access control (future)

### Data Protection
- HTTPS only in production
- Environment variables for secrets
- Input validation and sanitization
- Rate limiting on all endpoints
- CORS configuration

### API Security
- Helmet.js for security headers
- Rate limiting by IP
- Request size limits
- SQL injection prevention (parameterized queries)

## Scalability

### Current Architecture
- Stateless backend (horizontal scaling)
- Database connection pooling
- CDN for static assets
- Image optimization and caching

### Future Improvements
- Redis for session management
- Background job processing (Bull/BullMQ)
- Microservices architecture
- Kubernetes orchestration
- Message queue for async tasks

## Monitoring & Logging

### Application Logs
- Structured logging
- Log levels (error, warn, info, debug)
- Request/response logging

### Metrics
- API response times
- Error rates
- Database query performance
- External API latency

### Tools
- Application Performance Monitoring (APM)
- Error tracking (Sentry)
- Uptime monitoring
- Database monitoring

## Development Workflow

### Local Development
1. Run database locally or use Supabase cloud
2. Start backend: `npm run dev`
3. Start mobile: `npm start`
4. Use Expo Go for testing

### Testing
- Unit tests for business logic
- Integration tests for API endpoints
- E2E tests for critical flows
- Manual testing on devices

### CI/CD
- GitHub Actions workflows
- Automated testing on PR
- Automated builds on merge
- Deployment to staging/production

## Performance Considerations

### Backend
- Database query optimization
- Connection pooling
- Response caching
- Async operations for external APIs

### Mobile
- Image lazy loading
- Pagination for lists
- Local caching
- Optimistic UI updates

### Database
- Proper indexing
- Query optimization
- Regular VACUUM operations
- Connection pooling

## Error Handling

### Backend
- Try-catch blocks
- Error middleware
- Structured error responses
- Logging and monitoring

### Mobile
- Error boundaries
- User-friendly error messages
- Retry mechanisms
- Offline support

## Future Enhancements

### Planned Features
- Social sharing
- Collaborative designs
- Advanced AI features
- Analytics dashboard
- Admin panel

### Technical Improvements
- GraphQL API option
- Real-time features (WebSocket)
- Advanced caching strategies
- Multi-region deployment
- Automated scaling
