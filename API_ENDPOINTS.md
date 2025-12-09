# API Documentation - Proper Soccer Matcher

## Base URL
- **Development:** `http://localhost:3000/api/v1`
- **Production:** `https://api.propersoccermatcher.com/api/v1`

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### POST /auth/register
Register a new user (player or pitch owner).

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "player" // or "pitch_owner"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "player"
  },
  "access_token": "jwt_token_here",
  "refresh_token": "refresh_token_here"
}
```

### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "player"
  },
  "access_token": "jwt_token_here",
  "refresh_token": "refresh_token_here"
}
```

### POST /auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refresh_token": "refresh_token_here"
}
```

**Response (200):**
```json
{
  "access_token": "new_jwt_token"
}
```

### POST /auth/forgot-password
Request password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "message": "Password reset email sent"
}
```

### POST /auth/reset-password
Reset password using token from email.

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePass123!"
}
```

**Response (200):**
```json
{
  "message": "Password reset successful"
}
```

---

## ⚽ Pitch Endpoints

### GET /pitches
Get all pitches with optional filters.

**Query Parameters:**
- `search` (string): Search by name, location, description
- `city` (string): Filter by city
- `surface` (string): Filter by surface type (grass, artificial, indoor, hybrid)
- `size` (string): Filter by size (5-a-side, 7-a-side, 11-a-side)
- `minPrice` (number): Minimum price per hour
- `maxPrice` (number): Maximum price per hour
- `availableDate` (string): Filter by availability on date (YYYY-MM-DD)
- `sortBy` (string): Sort field (price, rating, name)
- `sortOrder` (string): Sort order (asc, desc)
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Champions League Arena",
      "description": "Professional-grade pitch",
      "address": "123 Football Street",
      "city": "London",
      "postcode": "SW1A 1AA",
      "surface": "artificial",
      "size": "11-a-side",
      "pricePerHour": 80,
      "images": ["url1", "url2"],
      "facilities": ["parking", "showers", "wifi"],
      "rating": 4.8,
      "totalReviews": 156,
      "status": "active",
      "owner": {
        "id": "uuid",
        "firstName": "Jane",
        "lastName": "Smith"
      }
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### GET /pitches/:id
Get single pitch by ID.

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Champions League Arena",
  "description": "Professional-grade pitch with floodlights",
  "address": "123 Football Street",
  "city": "London",
  "postcode": "SW1A 1AA",
  "surface": "artificial",
  "size": "11-a-side",
  "pricePerHour": 80,
  "images": ["url1", "url2", "url3"],
  "facilities": ["parking", "showers", "wifi", "changing_rooms"],
  "rating": 4.8,
  "totalReviews": 156,
  "status": "active",
  "owner": {
    "id": "uuid",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "phone": "+44 20 1234 5678"
  },
  "availability": {
    "monday": ["09:00-22:00"],
    "tuesday": ["09:00-22:00"],
    // ... other days
  }
}
```

### POST /pitches
Create a new pitch (pitch owners only). 🔒 Requires authentication.

**Request Body:**
```json
{
  "name": "My Pitch",
  "description": "Great pitch for all levels",
  "address": "456 Sports Road",
  "city": "Manchester",
  "postcode": "M1 1AA",
  "surface": "grass",
  "size": "7-a-side",
  "pricePerHour": 60,
  "images": ["url1", "url2"],
  "facilities": ["parking", "showers"]
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "name": "My Pitch",
  // ... full pitch object
}
```

### PATCH /pitches/:id
Update pitch details. 🔒 Requires authentication (owner only).

**Request Body:**
```json
{
  "pricePerHour": 70,
  "description": "Updated description",
  "facilities": ["parking", "showers", "wifi"]
}
```

**Response (200):**
```json
{
  "id": "uuid",
  // ... updated pitch object
}
```

### DELETE /pitches/:id
Delete a pitch. 🔒 Requires authentication (owner only).

**Response (200):**
```json
{
  "message": "Pitch deleted successfully"
}
```

### GET /pitches/my-pitches
Get all pitches owned by current user. 🔒 Requires authentication.

**Response (200):**
```json
{
  "data": [
    // ... array of pitch objects
  ],
  "meta": {
    "total": 3,
    "page": 1,
    "limit": 10
  }
}
```

### GET /pitches/:id/availability
Check pitch availability for a date range.

**Query Parameters:**
- `startDate` (string): Start date (YYYY-MM-DD)
- `endDate` (string): End date (YYYY-MM-DD)

**Response (200):**
```json
{
  "pitchId": "uuid",
  "availability": [
    {
      "date": "2025-12-10",
      "slots": [
        {
          "startTime": "09:00",
          "endTime": "10:00",
          "available": true,
          "price": 60
        },
        {
          "startTime": "10:00",
          "endTime": "11:00",
          "available": false,
          "bookingId": "uuid"
        }
      ]
    }
  ]
}
```

---

## 📅 Booking Endpoints

### POST /bookings
Create a new booking. 🔒 Requires authentication.

**Request Body:**
```json
{
  "pitchId": "uuid",
  "date": "2025-12-15",
  "startTime": "18:00",
  "endTime": "19:00",
  "playerCount": 10,
  "notes": "Birthday party match"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "pitchId": "uuid",
  "userId": "uuid",
  "date": "2025-12-15",
  "startTime": "18:00",
  "endTime": "19:00",
  "status": "pending",
  "totalAmount": 65.00,
  "paymentStatus": "pending",
  "playerCount": 10,
  "notes": "Birthday party match",
  "pitch": {
    "id": "uuid",
    "name": "Champions League Arena",
    "address": "123 Football Street",
    "city": "London",
    "images": ["url1"]
  },
  "paymentIntent": {
    "id": "pi_xxx",
    "clientSecret": "pi_xxx_secret_xxx",
    "amount": 6500,
    "currency": "gbp"
  }
}
```

### GET /bookings
Get all bookings for current user. 🔒 Requires authentication.

**Query Parameters:**
- `status` (string): Filter by status (pending, confirmed, cancelled, completed)
- `startDate` (string): Filter from date
- `endDate` (string): Filter to date
- `pitchId` (string): Filter by pitch
- `page` (number): Page number
- `limit` (number): Items per page

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "pitchId": "uuid",
      "pitchName": "Champions League Arena",
      "date": "2025-12-15",
      "startTime": "18:00",
      "endTime": "19:00",
      "status": "confirmed",
      "totalAmount": 65.00,
      "paymentStatus": "paid",
      "playerCount": 10,
      "pitch": {
        "id": "uuid",
        "name": "Champions League Arena",
        "city": "London",
        "images": ["url1"]
      }
    }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "limit": 10
  }
}
```

### GET /bookings/:id
Get single booking by ID. 🔒 Requires authentication.

**Response (200):**
```json
{
  "id": "uuid",
  "pitchId": "uuid",
  "userId": "uuid",
  "date": "2025-12-15",
  "startTime": "18:00",
  "endTime": "19:00",
  "status": "confirmed",
  "totalAmount": 65.00,
  "paymentStatus": "paid",
  "playerCount": 10,
  "notes": "Birthday party match",
  "pitch": {
    // ... full pitch object
  },
  "user": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  },
  "createdAt": "2025-12-09T10:30:00Z",
  "updatedAt": "2025-12-09T10:30:00Z"
}
```

### PATCH /bookings/:id/cancel
Cancel a booking. 🔒 Requires authentication.

**Request Body:**
```json
{
  "reason": "Change of plans"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "status": "cancelled",
  "refund": {
    "amount": 65.00,
    "status": "processing",
    "estimatedDate": "2025-12-11"
  }
}
```

### GET /bookings/owner
Get all bookings for pitch owner's pitches. 🔒 Requires authentication (pitch owner).

**Query Parameters:** Same as GET /bookings

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "pitchId": "uuid",
      "pitchName": "My Pitch",
      "customerName": "John Doe",
      "customerEmail": "john@example.com",
      "date": "2025-12-15",
      "startTime": "18:00",
      "endTime": "19:00",
      "status": "confirmed",
      "totalAmount": 65.00,
      "paymentStatus": "paid"
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 10
  }
}
```

---

## 💳 Payment Endpoints

### POST /payments/create-intent
Create a payment intent for a booking. 🔒 Requires authentication.

**Request Body:**
```json
{
  "bookingId": "uuid"
}
```

**Response (201):**
```json
{
  "paymentIntentId": "pi_xxx",
  "clientSecret": "pi_xxx_secret_xxx",
  "amount": 6500,
  "currency": "gbp",
  "status": "requires_payment_method"
}
```

### POST /payments/confirm
Confirm a payment. 🔒 Requires authentication.

**Request Body:**
```json
{
  "paymentIntentId": "pi_xxx",
  "paymentMethodId": "pm_xxx"
}
```

**Response (200):**
```json
{
  "paymentIntentId": "pi_xxx",
  "status": "succeeded",
  "amount": 6500,
  "receiptUrl": "https://stripe.com/receipt/xxx"
}
```

### POST /payments/refund
Request a refund for a booking. 🔒 Requires authentication.

**Request Body:**
```json
{
  "bookingId": "uuid",
  "reason": "Customer request",
  "amount": 6500 // optional, defaults to full refund
}
```

**Response (200):**
```json
{
  "refundId": "re_xxx",
  "status": "succeeded",
  "amount": 6500,
  "reason": "Customer request"
}
```

### GET /payments/transactions
Get payment transaction history. 🔒 Requires authentication.

**Query Parameters:**
- `startDate` (string): Filter from date
- `endDate` (string): Filter to date
- `type` (string): Filter by type (payment, refund)
- `page` (number): Page number
- `limit` (number): Items per page

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "bookingId": "uuid",
      "amount": 65.00,
      "type": "payment",
      "status": "completed",
      "paymentMethod": "card",
      "last4": "4242",
      "receiptUrl": "https://stripe.com/receipt/xxx",
      "createdAt": "2025-12-09T10:30:00Z"
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10
  }
}
```

---

## ⭐ Review Endpoints

### POST /reviews
Create a review for a pitch. 🔒 Requires authentication (must have completed booking).

**Request Body:**
```json
{
  "pitchId": "uuid",
  "bookingId": "uuid",
  "rating": 5,
  "comment": "Excellent pitch! Well maintained.",
  "facilities": 5,
  "location": 4,
  "valueForMoney": 5
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "pitchId": "uuid",
  "userId": "uuid",
  "rating": 5,
  "comment": "Excellent pitch! Well maintained.",
  "facilities": 5,
  "location": 4,
  "valueForMoney": 5,
  "user": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "createdAt": "2025-12-09T10:30:00Z"
}
```

### GET /reviews/pitch/:pitchId
Get all reviews for a pitch.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `sortBy` (string): Sort by (rating, date)

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "rating": 5,
      "comment": "Excellent pitch!",
      "user": {
        "firstName": "John",
        "lastName": "Doe"
      },
      "createdAt": "2025-12-09T10:30:00Z"
    }
  ],
  "meta": {
    "total": 156,
    "page": 1,
    "limit": 10,
    "averageRating": 4.8
  }
}
```

---

## 👤 User Endpoints

### GET /users/profile
Get current user profile. 🔒 Requires authentication.

**Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "player",
  "phone": "+44 20 1234 5678",
  "avatar": "https://...",
  "bio": "Passionate football player",
  "stats": {
    "totalBookings": 15,
    "totalSpent": 975.00,
    "favoritesPitches": 3
  }
}
```

### PATCH /users/profile
Update user profile. 🔒 Requires authentication.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+44 20 1234 5678",
  "bio": "Updated bio"
}
```

**Response (200):**
```json
{
  // ... updated user object
}
```

### POST /users/upload-avatar
Upload profile picture. 🔒 Requires authentication.

**Request:** Multipart form data with `avatar` file

**Response (200):**
```json
{
  "avatarUrl": "https://cdn.example.com/avatars/user-uuid.jpg"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "field": "email",
      "message": "Email is already in use"
    }
  ]
}
```

### Common Status Codes:
- **200** OK - Success
- **201** Created - Resource created
- **400** Bad Request - Validation error
- **401** Unauthorized - Authentication required
- **403** Forbidden - Insufficient permissions
- **404** Not Found - Resource not found
- **409** Conflict - Resource conflict (e.g., time slot taken)
- **500** Internal Server Error - Server error

---

## Rate Limiting

- **Anonymous requests:** 100 requests per 15 minutes
- **Authenticated requests:** 1000 requests per 15 minutes

Exceeded rate limit returns **429 Too Many Requests**.

---

## Pagination

All list endpoints support pagination:

**Request:**
```
GET /pitches?page=2&limit=20
```

**Response:**
```json
{
  "data": [...],
  "meta": {
    "total": 156,
    "page": 2,
    "limit": 20,
    "totalPages": 8
  }
}
```

---

## Webhooks (For Payment Processing)

### POST /webhooks/stripe
Stripe webhook endpoint for payment events.

**Events:**
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`

Requires Stripe signature verification.
