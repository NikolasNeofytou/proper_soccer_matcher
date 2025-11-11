# Technical Architecture Document

## System Overview

Proper Soccer Matcher is built on a modern, scalable microservices architecture designed to handle high traffic, real-time interactions, and seamless user experiences across web and mobile platforms.

## Architecture Principles

1. **Scalability**: Horizontal scaling for all services
2. **Reliability**: High availability with 99.9% uptime target
3. **Security**: End-to-end encryption and secure authentication
4. **Performance**: Sub-second response times for critical operations
5. **Maintainability**: Clean code, comprehensive testing, documentation

## Technology Stack Details

### Frontend Stack

#### Web Application
```
- Framework: React 18+ with TypeScript
- Build Tool: Vite
- State Management: Redux Toolkit + RTK Query
- Routing: React Router v6
- UI Components: 
  - Material-UI (MUI) v5 for component library
  - Tailwind CSS for custom styling
- Forms: React Hook Form + Zod validation
- Maps: Mapbox GL JS / Google Maps API
- Real-time: Socket.io-client
- Charts: Recharts / Chart.js
- Date/Time: date-fns
- HTTP Client: Axios
- Testing: Jest + React Testing Library + Cypress
```

#### Mobile Application
```
- Framework: React Native 0.72+
- Navigation: React Navigation v6
- State Management: Redux Toolkit
- UI: React Native Paper + Native Base
- Maps: react-native-maps
- Push Notifications: @react-native-firebase/messaging
- Storage: @react-native-async-storage/async-storage
- Testing: Jest + Detox
```

### Backend Stack

#### API Server
```
- Runtime: Node.js 20 LTS
- Framework: NestJS 10+ (built on Express)
- Language: TypeScript 5+
- Validation: class-validator + class-transformer
- Documentation: Swagger/OpenAPI
- Authentication: Passport.js + JWT
- Real-time: Socket.io
- Task Queue: Bull (Redis-based)
- Logging: Winston
- Testing: Jest + Supertest
```

#### Database & Storage
```
- Primary Database: PostgreSQL 15+
  - ORM: TypeORM / Prisma
  - Migrations: TypeORM migrations
  - Connection Pooling: pgBouncer

- Cache: Redis 7+
  - Session storage
  - Rate limiting
  - Real-time data
  - Job queues

- Search Engine: Elasticsearch 8+
  - Full-text search for pitches
  - Geospatial queries
  - Analytics aggregations

- File Storage: AWS S3
  - User uploads (photos, documents)
  - Static assets
  - Backup storage
```

#### Infrastructure
```
- Container Platform: Docker
- Orchestration: Kubernetes (AWS EKS / GKE)
- API Gateway: Kong / AWS API Gateway
- Load Balancer: AWS ALB / NGINX
- CDN: CloudFlare
- DNS: CloudFlare / Route53
- SSL/TLS: Let's Encrypt (automated)
```

#### DevOps & Monitoring
```
- Version Control: Git + GitHub
- CI/CD: GitHub Actions
- Container Registry: Docker Hub / AWS ECR
- Infrastructure as Code: Terraform
- Configuration Management: Kubernetes ConfigMaps/Secrets
- Monitoring: Prometheus + Grafana
- Logging: ELK Stack (Elasticsearch, Logstash, Kibana)
- Error Tracking: Sentry
- APM: New Relic / DataDog
- Uptime Monitoring: UptimeRobot / Pingdom
```

### Third-Party Services

#### Payment Processing
```
- Primary: Stripe
  - Payment intents API
  - Subscriptions
  - Split payments (Stripe Connect)
  - Webhooks for events
- Backup: PayPal
```

#### Authentication & Authorization
```
- OAuth Providers:
  - Google Sign-In
  - Facebook Login
  - Apple Sign In
- SMS Verification: Twilio Verify
- 2FA: TOTP (speakeasy library)
```

#### Communication
```
- Email: SendGrid
  - Transactional emails
  - Marketing campaigns
  - Email templates
- SMS: Twilio
  - Booking confirmations
  - Verification codes
- Push Notifications: Firebase Cloud Messaging
  - iOS & Android push
  - Web push notifications
```

#### Maps & Geolocation
```
- Primary: Mapbox
  - Interactive maps
  - Geocoding
  - Directions API
- Alternative: Google Maps Platform
  - Places API
  - Distance Matrix API
```

#### Analytics
```
- User Analytics: Mixpanel
- Web Analytics: Google Analytics 4
- Error Tracking: Sentry
- Performance: Google Lighthouse
```

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                              │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Web App    │  │   iOS App    │  │ Android App  │          │
│  │  (React.js)  │  │(React Native)│  │(React Native)│          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                   │
└─────────┼──────────────────┼──────────────────┼───────────────────┘
          │                  │                  │
          └──────────────────┴──────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         CDN Layer                                │
│                   (CloudFlare / AWS CloudFront)                  │
│                   - Static Assets                                │
│                   - DDoS Protection                              │
│                   - SSL/TLS Termination                          │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API Gateway Layer                            │
│                   (Kong / AWS API Gateway)                       │
│                   - Request Routing                              │
│                   - Rate Limiting                                │
│                   - Authentication                               │
│                   - Request/Response Transformation              │
└─────────────────────────────────────────────────────────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│  Auth Service  │  │  User Service  │  │ Pitch Service  │
│                │  │                │  │                │
│ - Login/Logout │  │ - Profiles     │  │ - Listings     │
│ - Registration │  │ - Preferences  │  │ - Availability │
│ - JWT Tokens   │  │ - Stats        │  │ - Amenities    │
└────────────────┘  └────────────────┘  └────────────────┘

          ▼                  ▼                  ▼
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│Booking Service │  │ Match Service  │  │Payment Service │
│                │  │                │  │                │
│ - Reservations │  │ - Match Create │  │ - Stripe       │
│ - Availability │  │ - Player Match │  │ - Invoicing    │
│ - Scheduling   │  │ - Teams        │  │ - Refunds      │
└────────────────┘  └────────────────┘  └────────────────┘

          ▼                  ▼                  ▼
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│ Notification   │  │ Review Service │  │ Search Service │
│    Service     │  │                │  │                │
│ - Push         │  │ - Ratings      │  │ - Elasticsearch│
│ - Email        │  │ - Comments     │  │ - Filters      │
│ - SMS          │  │ - Moderation   │  │ - Geospatial   │
└────────────────┘  └────────────────┘  └────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        Data Layer                                │
│                                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐            │
│  │ PostgreSQL  │  │    Redis    │  │Elasticsearch │            │
│  │             │  │             │  │              │            │
│  │ - Users     │  │ - Sessions  │  │ - Pitch      │            │
│  │ - Bookings  │  │ - Cache     │  │   Search     │            │
│  │ - Payments  │  │ - Queues    │  │ - Analytics  │            │
│  │ - Reviews   │  │ - Real-time │  │ - Logs       │            │
│  └─────────────┘  └─────────────┘  └──────────────┘            │
│                                                                   │
│  ┌─────────────┐  ┌─────────────┐                               │
│  │   AWS S3    │  │  Backups    │                               │
│  │             │  │             │                               │
│  │ - Images    │  │ - DB Dumps  │                               │
│  │ - Documents │  │ - Logs      │                               │
│  └─────────────┘  └─────────────┘                               │
└─────────────────────────────────────────────────────────────────┘
```

## Microservices Design

### 1. Auth Service
**Responsibility**: User authentication and authorization

**Endpoints**:
- POST /auth/register
- POST /auth/login
- POST /auth/logout
- POST /auth/refresh
- POST /auth/verify-email
- POST /auth/forgot-password
- POST /auth/reset-password
- POST /auth/2fa/enable
- POST /auth/2fa/verify

**Database**: PostgreSQL (users, sessions)

### 2. User Service
**Responsibility**: User profile management

**Endpoints**:
- GET /users/:id
- PUT /users/:id
- GET /users/:id/stats
- GET /users/:id/bookings
- GET /users/:id/matches
- POST /users/:id/avatar
- GET /players (search players)
- PUT /players/:id/skill-level

**Database**: PostgreSQL (profiles, player_stats)

### 3. Pitch Service
**Responsibility**: Venue management

**Endpoints**:
- GET /pitches
- GET /pitches/:id
- POST /pitches (owner only)
- PUT /pitches/:id (owner only)
- DELETE /pitches/:id (owner only)
- GET /pitches/:id/availability
- PUT /pitches/:id/availability
- GET /pitches/nearby (geospatial)

**Database**: PostgreSQL (pitches, amenities)

### 4. Booking Service
**Responsibility**: Reservation management

**Endpoints**:
- GET /bookings
- GET /bookings/:id
- POST /bookings
- PUT /bookings/:id
- DELETE /bookings/:id
- POST /bookings/:id/cancel
- GET /bookings/:id/invoice

**Database**: PostgreSQL (bookings, booking_slots)

### 5. Match Service
**Responsibility**: Player match creation and management

**Endpoints**:
- GET /matches
- GET /matches/:id
- POST /matches
- PUT /matches/:id
- POST /matches/:id/join
- DELETE /matches/:id/leave
- GET /matches/:id/participants
- POST /matches/:id/result

**Database**: PostgreSQL (matches, match_participants)

### 6. Payment Service
**Responsibility**: Payment processing

**Endpoints**:
- POST /payments/intent
- POST /payments/confirm
- POST /payments/refund
- GET /payments/:id
- POST /payments/split
- GET /payments/history

**Database**: PostgreSQL (payments, transactions)
**External**: Stripe API

### 7. Notification Service
**Responsibility**: Multi-channel notifications

**Endpoints**:
- POST /notifications
- GET /notifications/:userId
- PUT /notifications/:id/read
- POST /notifications/settings

**Database**: PostgreSQL (notifications), Redis (queue)
**External**: FCM, SendGrid, Twilio

### 8. Review Service
**Responsibility**: Ratings and reviews

**Endpoints**:
- GET /reviews/pitch/:pitchId
- POST /reviews
- PUT /reviews/:id
- DELETE /reviews/:id
- GET /reviews/:id/helpful
- POST /reviews/:id/report

**Database**: PostgreSQL (reviews, ratings)

### 9. Search Service
**Responsibility**: Advanced search functionality

**Endpoints**:
- GET /search/pitches
- GET /search/players
- GET /search/matches
- GET /search/suggest

**Database**: Elasticsearch

## Database Design

### Core Tables

#### users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255),
    role VARCHAR(20) NOT NULL, -- 'player', 'owner', 'admin'
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

#### player_profiles
```sql
CREATE TABLE player_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url VARCHAR(500),
    date_of_birth DATE,
    skill_level INTEGER DEFAULT 3, -- 1-7 scale
    preferred_position VARCHAR(50),
    play_style JSONB, -- tags like 'defensive', 'technical'
    bio TEXT,
    total_matches INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_player_profiles_user_id ON player_profiles(user_id);
CREATE INDEX idx_player_profiles_skill_level ON player_profiles(skill_level);
```

#### pitch_owners
```sql
CREATE TABLE pitch_owners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(50),
    tax_id VARCHAR(50),
    description TEXT,
    logo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### pitches
```sql
CREATE TABLE pitches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES pitch_owners(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    surface_type VARCHAR(50), -- 'grass', 'artificial', 'indoor'
    pitch_type VARCHAR(50), -- '5v5', '7v7', '11v11'
    has_lighting BOOLEAN DEFAULT FALSE,
    has_parking BOOLEAN DEFAULT FALSE,
    has_changing_rooms BOOLEAN DEFAULT FALSE,
    hourly_rate DECIMAL(10, 2),
    images JSONB, -- array of image URLs
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_pitches_owner_id ON pitches(owner_id);
CREATE INDEX idx_pitches_location ON pitches USING GIST (
    ll_to_earth(latitude, longitude)
);
```

#### bookings
```sql
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pitch_id UUID REFERENCES pitches(id),
    user_id UUID REFERENCES users(id),
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, completed, cancelled
    payment_status VARCHAR(20) DEFAULT 'pending',
    cancellation_reason TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bookings_pitch_id ON bookings(pitch_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
```

#### matches
```sql
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    creator_id UUID REFERENCES users(id),
    match_type VARCHAR(20), -- 'casual', 'competitive'
    format VARCHAR(10), -- '5v5', '7v7', '11v11'
    skill_level_min INTEGER,
    skill_level_max INTEGER,
    max_players INTEGER,
    is_public BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) DEFAULT 'open', -- open, full, ongoing, completed
    result JSONB, -- score, stats
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_matches_booking_id ON matches(booking_id);
CREATE INDEX idx_matches_creator_id ON matches(creator_id);
CREATE INDEX idx_matches_status ON matches(status);
```

#### match_participants
```sql
CREATE TABLE match_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    team VARCHAR(10), -- 'team_a', 'team_b'
    position VARCHAR(50),
    status VARCHAR(20) DEFAULT 'confirmed',
    joined_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_match_participants_match_id ON match_participants(match_id);
CREATE INDEX idx_match_participants_user_id ON match_participants(user_id);
```

#### payments
```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    user_id UUID REFERENCES users(id),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50),
    stripe_payment_intent_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending',
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
```

#### reviews
```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pitch_id UUID REFERENCES pitches(id),
    user_id UUID REFERENCES users(id),
    booking_id UUID REFERENCES bookings(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    images JSONB,
    helpful_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'published',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reviews_pitch_id ON reviews(pitch_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
```

## API Design Principles

### RESTful Conventions
- Use nouns for resource names
- Use HTTP methods correctly (GET, POST, PUT, DELETE)
- Use proper status codes
- Version APIs (/api/v1/...)

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message",
  "timestamp": "2025-01-15T10:00:00Z"
}
```

### Error Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [...]
  },
  "timestamp": "2025-01-15T10:00:00Z"
}
```

### Pagination
```
GET /api/v1/pitches?page=1&limit=20&sort=name&order=asc
```

Response:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

## Security Considerations

### Authentication
- JWT tokens with short expiration (15 minutes)
- Refresh tokens for extended sessions
- Secure token storage (httpOnly cookies)
- OAuth 2.0 for social login

### Authorization
- Role-based access control (RBAC)
- Resource-level permissions
- Middleware for route protection

### Data Protection
- Password hashing (bcrypt, 10+ rounds)
- Sensitive data encryption at rest
- TLS/SSL for data in transit
- PII data handling compliance (GDPR)

### API Security
- Rate limiting (100 req/min per IP)
- Request validation and sanitization
- CORS configuration
- API key authentication for third-party
- Input validation (XSS, SQL injection prevention)

### Infrastructure Security
- Regular security patches
- Firewall rules
- DDoS protection (CloudFlare)
- Regular backups
- Intrusion detection

## Performance Optimization

### Caching Strategy
- Redis for session data
- API response caching (CDN)
- Database query result caching
- Static asset caching

### Database Optimization
- Proper indexing
- Query optimization
- Connection pooling
- Read replicas for read-heavy operations

### Asset Optimization
- Image compression and resizing
- Lazy loading
- CDN delivery
- Minification and bundling

## Scalability Strategy

### Horizontal Scaling
- Stateless API servers
- Load balancing
- Database sharding (if needed)
- Microservices architecture

### Vertical Scaling
- Resource monitoring
- Auto-scaling policies
- Database optimization

## Monitoring & Logging

### Metrics to Track
- Request rate and latency
- Error rates
- Database query performance
- Cache hit rates
- User activity metrics
- Business metrics (bookings, revenue)

### Alerting
- Error rate thresholds
- Performance degradation
- Security incidents
- High resource usage

### Logging
- Centralized logging (ELK)
- Structured logs (JSON format)
- Log levels (ERROR, WARN, INFO, DEBUG)
- PII redaction in logs

## Disaster Recovery

### Backup Strategy
- Daily automated database backups
- Backup retention (30 days)
- Cross-region backup storage
- Regular restore testing

### High Availability
- Multi-AZ deployment
- Failover procedures
- Data replication
- Service health checks

## Development Workflow

### Git Workflow
- Main branch (production)
- Staging branch
- Feature branches (feature/*)
- Bug fix branches (fix/*)

### CI/CD Pipeline
1. Code commit
2. Automated tests
3. Code quality checks (ESLint, Prettier)
4. Security scans
5. Build Docker images
6. Deploy to staging
7. Integration tests
8. Manual approval
9. Deploy to production

### Testing Strategy
- Unit tests (80%+ coverage)
- Integration tests
- E2E tests
- Performance tests
- Security tests

## Deployment Strategy

### Environments
- Development (local)
- Staging (pre-production)
- Production

### Deployment Process
- Blue-green deployment
- Canary releases
- Rollback capability
- Zero-downtime deployments

## Conclusion

This technical architecture provides a solid foundation for building a scalable, secure, and performant soccer booking platform. The microservices approach allows for independent scaling and deployment of services, while the chosen technology stack ensures developer productivity and system reliability.
