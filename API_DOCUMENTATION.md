# API Documentation

## Base URL
```
Development: http://localhost:3000/api/v1
Staging: https://staging-api.propersoccermatcher.com/api/v1
Production: https://api.propersoccermatcher.com/api/v1
```

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2025-01-15T10:00:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": [...]
  },
  "timestamp": "2025-01-15T10:00:00Z"
}
```

### Pagination
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Invalid input data |
| UNAUTHORIZED | 401 | Missing or invalid authentication |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource conflict (e.g., duplicate booking) |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "role": "player",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "player"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

#### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "player"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

#### Refresh Token
```http
POST /auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_token",
    "refreshToken": "new_refresh_token"
  }
}
```

#### Logout
```http
POST /auth/logout
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

#### Request Password Reset
```http
POST /auth/forgot-password
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`

#### Reset Password
```http
POST /auth/reset-password
```

**Request Body:**
```json
{
  "token": "reset_token",
  "password": "NewSecurePass123!"
}
```

**Response:** `200 OK`

### Users

#### Get Current User
```http
GET /users/me
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "player",
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "avatarUrl": "https://...",
      "skillLevel": 5
    }
  }
}
```

#### Update Profile
```http
PUT /users/me
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "bio": "Passionate soccer player",
  "skillLevel": 5,
  "preferredPosition": "Midfielder"
}
```

**Response:** `200 OK`

#### Upload Avatar
```http
POST /users/me/avatar
```

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body:** Form data with `avatar` file

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "avatarUrl": "https://cdn.example.com/avatars/uuid.jpg"
  }
}
```

### Pitches

#### List Pitches
```http
GET /pitches?page=1&limit=20&city=London&surface=artificial_turf&minPrice=10&maxPrice=50
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20, max: 100)
- `city` (optional): Filter by city
- `surface` (optional): Filter by surface type
- `size` (optional): Filter by pitch size (5v5, 7v7, 11v11)
- `minPrice` (optional): Minimum hourly rate
- `maxPrice` (optional): Maximum hourly rate
- `hasLighting` (optional): Filter by lighting availability
- `hasParking` (optional): Filter by parking availability
- `sort` (optional): Sort field (price, rating, distance)
- `order` (optional): Sort order (asc, desc)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Premier Soccer Arena",
      "city": "London",
      "surfaceType": "artificial_turf",
      "pitchSize": "5v5",
      "hourlyRate": 30.00,
      "currency": "GBP",
      "averageRating": 4.5,
      "totalReviews": 120,
      "distance": 2.5,
      "images": ["url1", "url2"],
      "hasLighting": true,
      "hasParking": true
    }
  ],
  "pagination": { ... }
}
```

#### Search Nearby Pitches
```http
GET /pitches/nearby?lat=51.5074&lng=-0.1278&radius=5
```

**Query Parameters:**
- `lat` (required): Latitude
- `lng` (required): Longitude
- `radius` (optional): Search radius in km (default: 10)
- Other filters same as List Pitches

**Response:** `200 OK` (same format as List Pitches)

#### Get Pitch Details
```http
GET /pitches/:id
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Premier Soccer Arena",
    "description": "State-of-the-art facility...",
    "address": "123 Stadium Road",
    "city": "London",
    "postalCode": "SW1A 1AA",
    "latitude": 51.5074,
    "longitude": -0.1278,
    "surfaceType": "artificial_turf",
    "pitchSize": "5v5",
    "dimensions": "40x20m",
    "hourlyRate": 30.00,
    "currency": "GBP",
    "hasLighting": true,
    "hasParking": true,
    "hasChangingRooms": true,
    "hasShowers": true,
    "images": ["url1", "url2", "url3"],
    "cancellationPolicy": "Free cancellation up to 24h before",
    "averageRating": 4.5,
    "totalReviews": 120,
    "owner": {
      "id": "uuid",
      "businessName": "Soccer Facilities Ltd",
      "logoUrl": "https://..."
    }
  }
}
```

#### Create Pitch (Owner Only)
```http
POST /pitches
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "My Soccer Pitch",
  "description": "Professional quality pitch",
  "address": "123 Stadium Road",
  "city": "London",
  "postalCode": "SW1A 1AA",
  "latitude": 51.5074,
  "longitude": -0.1278,
  "surfaceType": "artificial_turf",
  "pitchSize": "7v7",
  "hourlyRate": 40.00,
  "hasLighting": true,
  "hasParking": true,
  "hasChangingRooms": true
}
```

**Response:** `201 Created`

#### Update Pitch (Owner Only)
```http
PUT /pitches/:id
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Same as Create Pitch (partial updates allowed)

**Response:** `200 OK`

#### Delete Pitch (Owner Only)
```http
DELETE /pitches/:id
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `204 No Content`

#### Get Pitch Availability
```http
GET /pitches/:id/availability?date=2025-01-15
```

**Query Parameters:**
- `date` (required): Date in YYYY-MM-DD format

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "date": "2025-01-15",
    "slots": [
      {
        "startTime": "09:00",
        "endTime": "10:00",
        "available": true,
        "price": 30.00
      },
      {
        "startTime": "10:00",
        "endTime": "11:00",
        "available": false,
        "price": 30.00,
        "bookedBy": "John D."
      }
    ]
  }
}
```

### Bookings

#### Create Booking
```http
POST /bookings
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "pitchId": "uuid",
  "bookingDate": "2025-01-20",
  "startTime": "14:00",
  "endTime": "16:00",
  "notes": "Birthday celebration match",
  "voucherCode": "SOCCER10"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "pitchId": "uuid",
    "bookingDate": "2025-01-20",
    "startTime": "14:00",
    "endTime": "16:00",
    "durationMinutes": 120,
    "totalAmount": 54.00,
    "status": "pending",
    "paymentStatus": "pending",
    "paymentIntent": {
      "clientSecret": "pi_xxx_secret_xxx"
    }
  }
}
```

#### Get User Bookings
```http
GET /bookings?status=confirmed&page=1&limit=20
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (optional): Filter by status
- `page`, `limit`: Pagination

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "pitch": {
        "id": "uuid",
        "name": "Premier Soccer Arena",
        "city": "London"
      },
      "bookingDate": "2025-01-20",
      "startTime": "14:00",
      "endTime": "16:00",
      "totalAmount": 60.00,
      "status": "confirmed",
      "paymentStatus": "paid"
    }
  ],
  "pagination": { ... }
}
```

#### Get Booking Details
```http
GET /bookings/:id
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

#### Cancel Booking
```http
POST /bookings/:id/cancel
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "reason": "Schedule conflict"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "cancelled",
    "refundAmount": 50.00,
    "refundStatus": "processing"
  }
}
```

### Matches

#### List Matches
```http
GET /matches?status=open&format=5v5&skillLevel=4-6
```

**Query Parameters:**
- `status` (optional): Filter by status (open, full, ongoing, completed)
- `format` (optional): Match format (5v5, 7v7, 11v11)
- `skillLevel` (optional): Skill level range (e.g., "4-6")
- `date` (optional): Filter by date
- `city` (optional): Filter by city
- `isPublic` (optional): Public matches only

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Friday Evening 5v5",
      "format": "5v5",
      "matchType": "casual",
      "skillLevelMin": 4,
      "skillLevelMax": 6,
      "maxPlayers": 10,
      "currentPlayers": 7,
      "status": "open",
      "matchDate": "2025-01-20",
      "matchTime": "18:00",
      "pitch": {
        "id": "uuid",
        "name": "Premier Soccer Arena",
        "city": "London"
      },
      "creator": {
        "id": "uuid",
        "firstName": "John",
        "skillLevel": 5
      }
    }
  ],
  "pagination": { ... }
}
```

#### Get Match Details
```http
GET /matches/:id
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Friday Evening 5v5",
    "description": "Casual match for fun",
    "format": "5v5",
    "matchType": "casual",
    "skillLevelMin": 4,
    "skillLevelMax": 6,
    "maxPlayers": 10,
    "currentPlayers": 7,
    "status": "open",
    "matchDate": "2025-01-20",
    "matchTime": "18:00",
    "booking": { ... },
    "pitch": { ... },
    "creator": { ... },
    "participants": [
      {
        "id": "uuid",
        "user": {
          "firstName": "John",
          "skillLevel": 5
        },
        "team": "team_a",
        "position": "Midfielder",
        "status": "confirmed"
      }
    ]
  }
}
```

#### Create Match
```http
POST /matches
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "bookingId": "uuid",
  "title": "Weekend 5v5 Match",
  "description": "Looking for players",
  "format": "5v5",
  "matchType": "casual",
  "skillLevelMin": 3,
  "skillLevelMax": 6,
  "maxPlayers": 10,
  "isPublic": true
}
```

**Response:** `201 Created`

#### Join Match
```http
POST /matches/:id/join
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "preferredPosition": "Midfielder"
}
```

**Response:** `200 OK`

#### Leave Match
```http
DELETE /matches/:id/leave
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

#### Update Match Result (Creator Only)
```http
POST /matches/:id/result
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "teamAScore": 5,
  "teamBScore": 3,
  "playerStats": [
    {
      "userId": "uuid",
      "goals": 2,
      "assists": 1
    }
  ]
}
```

**Response:** `200 OK`

### Reviews

#### Get Pitch Reviews
```http
GET /reviews/pitch/:pitchId?page=1&limit=20&sort=rating&order=desc
```

**Query Parameters:**
- `page`, `limit`: Pagination
- `sort`: Sort by (rating, date, helpful)
- `order`: asc or desc

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "rating": 5,
      "title": "Excellent facility!",
      "comment": "Great pitch, well maintained...",
      "user": {
        "firstName": "John",
        "avatarUrl": "https://..."
      },
      "ratingFacility": 5,
      "ratingSurface": 5,
      "ratingLocation": 4,
      "ratingValue": 5,
      "images": ["url1", "url2"],
      "helpfulCount": 15,
      "ownerResponse": "Thank you for your feedback!",
      "createdAt": "2025-01-10T10:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

#### Create Review
```http
POST /reviews
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "pitchId": "uuid",
  "bookingId": "uuid",
  "rating": 5,
  "title": "Great experience",
  "comment": "Excellent facility with all amenities",
  "ratingFacility": 5,
  "ratingSurface": 5,
  "ratingLocation": 4,
  "ratingValue": 5,
  "images": ["base64_or_urls"]
}
```

**Response:** `201 Created`

#### Mark Review Helpful
```http
POST /reviews/:id/helpful
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "isHelpful": true
}
```

**Response:** `200 OK`

### Notifications

#### Get User Notifications
```http
GET /notifications?read=false&page=1&limit=50
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `read` (optional): Filter by read status
- `page`, `limit`: Pagination

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "booking_confirmed",
      "title": "Booking Confirmed",
      "message": "Your booking at Premier Soccer Arena has been confirmed",
      "read": false,
      "priority": "high",
      "actionUrl": "/bookings/uuid",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

#### Mark Notification as Read
```http
PUT /notifications/:id/read
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

#### Mark All as Read
```http
PUT /notifications/read-all
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

### Payments

#### Create Payment Intent
```http
POST /payments/intent
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "bookingId": "uuid",
  "amount": 60.00,
  "currency": "USD"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_xxx_secret_xxx",
    "paymentIntentId": "pi_xxx"
  }
}
```

#### Confirm Payment
```http
POST /payments/confirm
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "paymentIntentId": "pi_xxx"
}
```

**Response:** `200 OK`

#### Get Payment History
```http
GET /payments/history?page=1&limit=20
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

### Search

#### Global Search
```http
GET /search?q=soccer&type=pitches,players,matches
```

**Query Parameters:**
- `q` (required): Search query
- `type` (optional): Comma-separated types to search
- `page`, `limit`: Pagination

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "pitches": [...],
    "players": [...],
    "matches": [...]
  }
}
```

## WebSocket Events

### Connection
```javascript
const socket = io('wss://api.propersoccermatcher.com', {
  auth: {
    token: 'jwt_token'
  }
});
```

### Events

#### Match Updates
```javascript
// Subscribe to match updates
socket.emit('match:subscribe', { matchId: 'uuid' });

// Receive updates
socket.on('match:updated', (data) => {
  console.log('Match updated:', data);
});
```

#### Booking Status
```javascript
socket.on('booking:status', (data) => {
  console.log('Booking status changed:', data);
});
```

#### New Message
```javascript
socket.on('message:new', (data) => {
  console.log('New message:', data);
});
```

## Rate Limiting

- **Authenticated requests**: 1000 requests per hour per user
- **Unauthenticated requests**: 100 requests per hour per IP
- **Search endpoints**: 100 requests per hour
- **File uploads**: 10 requests per hour

## Best Practices

1. **Always include error handling** for API calls
2. **Use pagination** for list endpoints
3. **Cache responses** when appropriate
4. **Implement retry logic** with exponential backoff
5. **Use websockets** for real-time updates
6. **Validate input** on the client side before sending
7. **Handle rate limiting** gracefully
8. **Keep tokens secure** - never expose in URLs or logs

## SDKs and Libraries

### JavaScript/TypeScript
```bash
npm install @propersoccermatcher/api-client
```

```javascript
import { ProperSoccerMatcher } from '@propersoccermatcher/api-client';

const client = new ProperSoccerMatcher({
  apiKey: 'your_api_key',
  environment: 'production'
});

const pitches = await client.pitches.list({ city: 'London' });
```

### Mobile (React Native)
```bash
npm install @propersoccermatcher/mobile-sdk
```

## Changelog

### v1.0.0 (2025-01-15)
- Initial API release
- Core endpoints for users, pitches, bookings, matches
- Payment integration
- Real-time notifications

### Upcoming Features
- [ ] Team management endpoints
- [ ] League and tournament APIs
- [ ] Advanced analytics endpoints
- [ ] Video upload support
- [ ] AI-powered recommendations
