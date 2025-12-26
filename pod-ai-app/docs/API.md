# API Documentation

Base URL: `https://api.example.com` (development: `http://localhost:3000`)

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /api/auth/register

Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "userId": "uuid"
}
```

#### POST /api/auth/login

Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST /api/auth/refresh

Refresh authentication token.

**Response:**
```json
{
  "token": "new-jwt-token"
}
```

### Images

#### POST /api/images/generate

Generate an AI image.

**Request Body:**
```json
{
  "prompt": "A beautiful sunset over mountains",
  "options": {
    "size": "1024x1024",
    "style": "realistic"
  }
}
```

**Response:**
```json
{
  "imageId": "uuid",
  "imageUrl": "https://storage.example.com/image.png",
  "thumbnailUrl": "https://storage.example.com/thumb.png"
}
```

#### GET /api/images

List all images for the authenticated user.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**
```json
{
  "images": [
    {
      "id": "uuid",
      "prompt": "A beautiful sunset",
      "imageUrl": "https://...",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 42,
  "page": 1,
  "totalPages": 3
}
```

#### GET /api/images/:id

Get a specific image by ID.

**Response:**
```json
{
  "id": "uuid",
  "prompt": "A beautiful sunset",
  "imageUrl": "https://...",
  "status": "generated",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### DELETE /api/images/:id

Delete an image.

**Response:**
```json
{
  "message": "Image deleted successfully"
}
```

### Orders

#### POST /api/orders

Create a new order.

**Request Body:**
```json
{
  "items": [
    {
      "productId": "uuid",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "country": "US"
  }
}
```

**Response:**
```json
{
  "orderId": "uuid",
  "status": "pending",
  "totalAmount": 29.99
}
```

#### GET /api/orders

List all orders for the authenticated user.

**Response:**
```json
{
  "orders": [
    {
      "id": "uuid",
      "status": "pending",
      "totalAmount": 29.99,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### GET /api/orders/:id

Get a specific order by ID.

**Response:**
```json
{
  "id": "uuid",
  "status": "shipped",
  "totalAmount": 29.99,
  "items": [...],
  "shippingAddress": {...},
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Payments

#### POST /api/payments/create-intent

Create a Stripe payment intent.

**Request Body:**
```json
{
  "orderId": "uuid",
  "amount": 2999
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

#### POST /api/payments/confirm

Confirm a payment.

**Request Body:**
```json
{
  "paymentIntentId": "pi_xxx"
}
```

**Response:**
```json
{
  "status": "succeeded",
  "paymentId": "uuid"
}
```

#### GET /api/payments/:id

Get payment details.

**Response:**
```json
{
  "id": "uuid",
  "orderId": "uuid",
  "amount": 29.99,
  "status": "succeeded",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

- General API: 100 requests per 15 minutes
- Authentication: 5 requests per 15 minutes
- Image generation: 20 requests per hour
