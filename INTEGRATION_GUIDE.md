# Backend Integration Guide

This guide shows you how to connect the frontend to the backend API and test the full stack application.

## Quick Start

### 1. Backend Setup

```powershell
# Navigate to backend
cd packages\backend

# Install dependencies (if not already done)
npm install

# Create .env file from example
Copy-Item .env.example .env

# Edit .env with your actual values:
# - Database credentials (postgres on port 5433)
# - JWT secrets (generate random strings)
# - Stripe keys (from Stripe Dashboard)
# - Email service credentials
```

### 2. Frontend Setup

```powershell
# Navigate to frontend
cd packages\frontend

# Install dependencies (if not already done)
npm install

# Create .env.local file from example
Copy-Item .env.example .env.local

# Edit .env.local:
# - NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
# - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

### 3. Start Services

```powershell
# From project root, start all services with Docker
docker-compose up -d

# Or use the PowerShell script
.\start.ps1
```

This starts:
- PostgreSQL (port 5433)
- Redis (port 6380)
- Elasticsearch (port 9200)
- Backend API (port 3000)
- Frontend (port 3001)

---

## Testing the Integration

### Test 1: Health Check

```powershell
# Test backend is running
Invoke-WebRequest http://localhost:3000/api/v1/health

# Expected: {"status":"ok","timestamp":"2025-12-09T..."}
```

### Test 2: Registration Flow

```powershell
# Register a new user
$body = @{
    email = "test@example.com"
    password = "SecurePass123!"
    firstName = "John"
    lastName = "Doe"
    role = "player"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:3000/api/v1/auth/register `
    -Method POST `
    -Body $body `
    -ContentType "application/json"

# Expected: Response with user object and access_token
```

### Test 3: Login Flow

```powershell
# Login
$body = @{
    email = "test@example.com"
    password = "SecurePass123!"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri http://localhost:3000/api/v1/auth/login `
    -Method POST `
    -Body $body `
    -ContentType "application/json"

$token = ($response.Content | ConvertFrom-Json).access_token
Write-Host "Token: $token"
```

### Test 4: Protected Endpoint

```powershell
# Get user profile (requires authentication)
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-WebRequest -Uri http://localhost:3000/api/v1/users/profile `
    -Headers $headers

# Expected: User profile data
```

### Test 5: Search Pitches

```powershell
# Search for pitches (public endpoint)
Invoke-WebRequest "http://localhost:3000/api/v1/pitches?city=London&limit=5"

# Expected: Array of pitches with pagination metadata
```

---

## Frontend Testing

### Test Authentication UI

1. Open http://localhost:3001
2. Click "Sign Up" or go to http://localhost:3001/register
3. Fill in registration form:
   - Email: `test2@example.com`
   - Password: `SecurePass123!`
   - First Name: `Jane`
   - Last Name: `Smith`
   - Role: Player or Pitch Owner
4. Click "Create Account"
5. Should redirect to dashboard with user data

### Test Login UI

1. Go to http://localhost:3001/login
2. Enter credentials from registration
3. Click "Sign In"
4. Should redirect to appropriate dashboard (player or business)

### Test Pitch Discovery

1. Go to http://localhost:3001/discover
2. Should see pitch cards (may be empty if no pitches in database)
3. Try search filters:
   - Location search
   - Surface type filter
   - Price range slider
   - Date picker
4. Verify API calls in browser DevTools Network tab

### Test Booking Flow

1. Navigate to a pitch detail page
2. Select date and time
3. Click "Book Now"
4. Should see booking summary
5. Enter payment details (use Stripe test card: 4242 4242 4242 4242)
6. Complete booking
7. Verify booking appears in player dashboard

---

## API Client Architecture

### Client Structure

```
packages/frontend/lib/api/
├── client.ts          # Axios instance with interceptors
├── auth.ts            # Authentication endpoints
├── pitches.ts         # Pitch endpoints
├── bookings.ts        # Booking endpoints
├── payments.ts        # Payment endpoints
├── reviews.ts         # Review endpoints
└── users.ts           # User endpoints
```

### How It Works

1. **Base Client** (`client.ts`):
   - Creates axios instance with base URL
   - Adds auth token to all requests via interceptor
   - Handles token refresh on 401 errors
   - Global error handling

2. **API Modules**:
   - Each module exports typed functions
   - Uses `apiClient` from `client.ts`
   - Provides TypeScript interfaces for request/response

3. **Authentication Flow**:
   ```
   User Login → Store tokens in localStorage
   → Interceptor adds token to requests
   → If 401, try refresh token
   → If refresh fails, redirect to login
   ```

### Example: Using the API Client

```typescript
// In a React component
import { authApi } from '@/lib/api/auth';
import { pitchesApi } from '@/lib/api/pitches';

// Login
const handleLogin = async (email: string, password: string) => {
  try {
    const response = await authApi.login({ email, password });
    
    // Store tokens
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    
    // Redirect to dashboard
    router.push('/dashboard');
  } catch (error) {
    console.error('Login failed:', error);
  }
};

// Search pitches
const searchPitches = async () => {
  try {
    const response = await pitchesApi.getPitches({
      city: 'London',
      surface: 'artificial',
      page: 1,
      limit: 10
    });
    
    setPitches(response.pitches);
  } catch (error) {
    console.error('Search failed:', error);
  }
};
```

---

## Common Issues & Solutions

### Issue: "Network Error" or "ECONNREFUSED"

**Solution:**
1. Check backend is running: `docker ps`
2. Verify port 3000 is accessible: `Invoke-WebRequest http://localhost:3000/api/v1/health`
3. Check firewall settings
4. Verify `NEXT_PUBLIC_API_URL` in `.env.local`

### Issue: "401 Unauthorized"

**Solution:**
1. Check token is being sent: Open DevTools → Network → Check request headers
2. Verify token in localStorage: `localStorage.getItem('accessToken')`
3. Try logging in again to get fresh token
4. Check JWT_SECRET in backend `.env` matches what was used to sign tokens

### Issue: "CORS Error"

**Solution:**
1. Backend needs CORS configuration in `main.ts`:
   ```typescript
   app.enableCors({
     origin: process.env.FRONTEND_URL || 'http://localhost:3001',
     credentials: true,
   });
   ```
2. Verify `FRONTEND_URL` in backend `.env`

### Issue: Database Connection Failed

**Solution:**
1. Check PostgreSQL is running: `docker ps | findstr postgres`
2. Verify database credentials in `.env`
3. Check port 5433 is not in use: `netstat -an | findstr 5433`
4. Try connecting manually: `psql -h localhost -p 5433 -U postgres`

### Issue: Stripe Payment Not Working

**Solution:**
1. Verify Stripe keys in both frontend and backend `.env` files
2. Use test card: 4242 4242 4242 4242
3. Check Stripe webhook endpoint is configured
4. View Stripe logs in dashboard: https://dashboard.stripe.com/test/logs

---

## Environment Variables Reference

### Frontend (.env.local)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3000/api/v1` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | `pk_test_xxx` |
| `NEXT_PUBLIC_APP_URL` | Frontend URL | `http://localhost:3001` |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps key | (optional) |

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_HOST` | PostgreSQL host | `localhost` |
| `DATABASE_PORT` | PostgreSQL port | `5433` |
| `DATABASE_USER` | Database user | `postgres` |
| `DATABASE_PASSWORD` | Database password | `postgres` |
| `DATABASE_NAME` | Database name | `proper_soccer_matcher` |
| `JWT_SECRET` | JWT signing secret | (generate random string) |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_xxx` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | `whsec_xxx` |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6380` |

---

## Monitoring & Debugging

### Backend Logs

```powershell
# View backend logs
docker logs proper_soccer_matcher_backend -f

# Or if running locally
cd packages\backend
npm run start:dev
```

### Frontend Logs

```powershell
# View frontend logs
docker logs proper_soccer_matcher_frontend -f

# Or if running locally
cd packages\frontend
npm run dev
```

### Database Queries

```powershell
# Connect to PostgreSQL
docker exec -it proper_soccer_matcher_postgres psql -U postgres -d proper_soccer_matcher

# Run queries
SELECT * FROM users;
SELECT * FROM pitches;
SELECT * FROM bookings WHERE status = 'confirmed';
```

### Redis Cache

```powershell
# Connect to Redis
docker exec -it proper_soccer_matcher_redis redis-cli

# View cached data
KEYS *
GET some-cache-key
```

---

## API Testing with Postman/Insomnia

### Import Collection

Create a collection with these requests:

**1. Register**
```
POST http://localhost:3000/api/v1/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "player"
}
```

**2. Login**
```
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "SecurePass123!"
}

# Save the access_token from response
```

**3. Get Profile**
```
GET http://localhost:3000/api/v1/users/profile
Authorization: Bearer {{access_token}}
```

**4. Search Pitches**
```
GET http://localhost:3000/api/v1/pitches?city=London&limit=10
Authorization: Bearer {{access_token}}
```

**5. Create Booking**
```
POST http://localhost:3000/api/v1/bookings
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "pitchId": "{{pitch_id}}",
  "date": "2025-12-15",
  "startTime": "18:00",
  "endTime": "19:00",
  "playerCount": 10
}
```

---

## Next Steps

After successful integration:

1. ✅ **Authentication is working** → Test all auth flows
2. ✅ **Pitch discovery is working** → Add real pitch data
3. ✅ **Booking flow is working** → Test payment integration
4. 🚧 **Business Dashboard** → Connect pitch management
5. 🚧 **Reviews System** → Implement review endpoints
6. 🚧 **Email Notifications** → Configure email service
7. 🚧 **Image Uploads** → Set up AWS S3 or local storage

---

## Production Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) for:
- Production environment setup
- Database migrations
- SSL/TLS configuration
- CI/CD pipeline
- Monitoring & logging
- Backup strategies
