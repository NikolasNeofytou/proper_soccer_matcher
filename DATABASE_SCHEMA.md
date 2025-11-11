# Database Schema

## Overview
This document describes the complete database schema for the Proper Soccer Matcher platform. The schema is designed for PostgreSQL 15+ and follows best practices for data normalization, indexing, and performance.

## Entity Relationship Diagram

```
users ──┬── player_profiles
        ├── pitch_owners ── pitches ──┬── bookings ──┬── matches ── match_participants
        ├── bookings                  │              │
        ├── matches                    │              ├── payments
        ├── payments                   │              └── reviews
        ├── reviews                    │
        ├── notifications              └── pitch_availability
        ├── messages
        └── user_favorites
```

## Tables

### 1. users
**Purpose**: Central user authentication and account management

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255), -- NULL for OAuth-only users
    role VARCHAR(20) NOT NULL CHECK (role IN ('player', 'owner', 'admin')),
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
```

### 2. player_profiles
**Purpose**: Player-specific information and statistics

```sql
CREATE TABLE player_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(500),
    date_of_birth DATE,
    gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    skill_level INTEGER DEFAULT 3 CHECK (skill_level >= 1 AND skill_level <= 7),
    preferred_position VARCHAR(50), -- 'Goalkeeper', 'Defender', 'Midfielder', 'Forward'
    play_style JSONB DEFAULT '[]'::jsonb, -- ['defensive', 'technical', 'aggressive']
    bio TEXT,
    height_cm INTEGER,
    weight_kg INTEGER,
    
    -- Statistics
    total_matches INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    draws INTEGER DEFAULT 0,
    goals_scored INTEGER DEFAULT 0,
    assists INTEGER DEFAULT 0,
    clean_sheets INTEGER DEFAULT 0,
    
    -- Preferences
    notifications_enabled BOOLEAN DEFAULT TRUE,
    location_public BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_player_profiles_user_id ON player_profiles(user_id);
CREATE INDEX idx_player_profiles_skill_level ON player_profiles(skill_level);
CREATE INDEX idx_player_profiles_name ON player_profiles(first_name, last_name);
```

### 3. pitch_owners
**Purpose**: Business/venue owner information

```sql
CREATE TABLE pitch_owners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(50), -- 'individual', 'company', 'club', 'municipality'
    tax_id VARCHAR(50),
    description TEXT,
    logo_url VARCHAR(500),
    website_url VARCHAR(500),
    
    -- Contact information
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    
    -- Business details
    registration_number VARCHAR(100),
    verified BOOLEAN DEFAULT FALSE,
    verification_date TIMESTAMP,
    
    -- Statistics
    total_bookings INTEGER DEFAULT 0,
    total_revenue DECIMAL(12, 2) DEFAULT 0,
    average_rating DECIMAL(3, 2),
    total_reviews INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_pitch_owners_user_id ON pitch_owners(user_id);
CREATE INDEX idx_pitch_owners_verified ON pitch_owners(verified);
```

### 4. pitches
**Purpose**: Soccer field/pitch listings

```sql
CREATE TABLE pitches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES pitch_owners(id) ON DELETE CASCADE,
    
    -- Basic information
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Location
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    
    -- Pitch specifications
    surface_type VARCHAR(50) NOT NULL, -- 'natural_grass', 'artificial_turf', 'indoor'
    pitch_size VARCHAR(50) NOT NULL, -- '5v5', '7v7', '11v11', 'futsal'
    dimensions VARCHAR(50), -- '40x20m', '60x40m', etc.
    
    -- Amenities
    has_lighting BOOLEAN DEFAULT FALSE,
    has_parking BOOLEAN DEFAULT FALSE,
    has_changing_rooms BOOLEAN DEFAULT FALSE,
    has_showers BOOLEAN DEFAULT FALSE,
    has_equipment_rental BOOLEAN DEFAULT FALSE,
    has_spectator_seating BOOLEAN DEFAULT FALSE,
    has_refreshments BOOLEAN DEFAULT FALSE,
    has_wifi BOOLEAN DEFAULT FALSE,
    
    -- Capacity
    max_players INTEGER,
    
    -- Pricing
    hourly_rate DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    deposit_required BOOLEAN DEFAULT FALSE,
    deposit_amount DECIMAL(10, 2),
    
    -- Media
    images JSONB DEFAULT '[]'::jsonb, -- [{"url": "...", "order": 1}, ...]
    videos JSONB DEFAULT '[]'::jsonb,
    
    -- Policies
    cancellation_policy TEXT,
    rules TEXT,
    minimum_booking_hours DECIMAL(3, 1) DEFAULT 1.0,
    advance_booking_days INTEGER DEFAULT 30,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance', 'deleted')),
    featured BOOLEAN DEFAULT FALSE,
    
    -- Statistics
    total_bookings INTEGER DEFAULT 0,
    average_rating DECIMAL(3, 2),
    total_reviews INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_pitches_owner_id ON pitches(owner_id);
CREATE INDEX idx_pitches_status ON pitches(status);
CREATE INDEX idx_pitches_featured ON pitches(featured);
CREATE INDEX idx_pitches_city ON pitches(city);
CREATE INDEX idx_pitches_surface_type ON pitches(surface_type);
CREATE INDEX idx_pitches_pitch_size ON pitches(pitch_size);

-- Geospatial index for location-based queries
CREATE INDEX idx_pitches_location ON pitches USING GIST (
    ll_to_earth(latitude, longitude)
);
```

### 5. pitch_availability
**Purpose**: Manage pitch availability schedules

```sql
CREATE TABLE pitch_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pitch_id UUID NOT NULL REFERENCES pitches(id) ON DELETE CASCADE,
    
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    
    is_available BOOLEAN DEFAULT TRUE,
    price_override DECIMAL(10, 2), -- Override default hourly rate for this slot
    
    -- Date range for temporary availability changes
    effective_from DATE,
    effective_until DATE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(pitch_id, day_of_week, start_time, end_time)
);

CREATE INDEX idx_pitch_availability_pitch_id ON pitch_availability(pitch_id);
CREATE INDEX idx_pitch_availability_day ON pitch_availability(day_of_week);
```

### 6. bookings
**Purpose**: Reservation records

```sql
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pitch_id UUID NOT NULL REFERENCES pitches(id),
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- Booking details
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL,
    
    -- Pricing
    hourly_rate DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    deposit_amount DECIMAL(10, 2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Status tracking
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'ongoing', 'completed', 'cancelled')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'partial_refund')),
    
    -- Cancellation
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP,
    cancelled_by UUID REFERENCES users(id),
    refund_amount DECIMAL(10, 2),
    
    -- Additional info
    notes TEXT,
    special_requests TEXT,
    
    -- Confirmations
    confirmed_at TIMESTAMP,
    checked_in_at TIMESTAMP,
    checked_out_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bookings_pitch_id ON bookings(pitch_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX idx_bookings_date_time ON bookings(booking_date, start_time);

-- Prevent double bookings
CREATE UNIQUE INDEX idx_bookings_no_overlap ON bookings(pitch_id, booking_date, start_time, end_time) 
    WHERE status NOT IN ('cancelled');
```

### 7. matches
**Purpose**: Player-organized soccer matches

```sql
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    creator_id UUID NOT NULL REFERENCES users(id),
    
    -- Match details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    match_type VARCHAR(20) NOT NULL DEFAULT 'casual' CHECK (match_type IN ('casual', 'competitive', 'friendly', 'tournament')),
    format VARCHAR(10) NOT NULL, -- '5v5', '7v7', '11v11', 'futsal'
    
    -- Player requirements
    skill_level_min INTEGER CHECK (skill_level_min >= 1 AND skill_level_min <= 7),
    skill_level_max INTEGER CHECK (skill_level_max >= 1 AND skill_level_max <= 7),
    min_age INTEGER,
    max_age INTEGER,
    gender_requirement VARCHAR(20), -- 'male', 'female', 'mixed', 'any'
    
    -- Capacity
    max_players INTEGER NOT NULL,
    current_players INTEGER DEFAULT 1, -- Creator is first player
    
    -- Visibility and joining
    is_public BOOLEAN DEFAULT TRUE,
    requires_approval BOOLEAN DEFAULT FALSE,
    join_code VARCHAR(20), -- For private matches
    
    -- Status
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'full', 'ongoing', 'completed', 'cancelled')),
    
    -- Results
    team_a_score INTEGER,
    team_b_score INTEGER,
    result_data JSONB, -- Detailed stats: goals, assists, etc.
    
    -- Match date/time (if different from booking)
    match_date DATE,
    match_time TIME,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

CREATE INDEX idx_matches_booking_id ON matches(booking_id);
CREATE INDEX idx_matches_creator_id ON matches(creator_id);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_public ON matches(is_public);
CREATE INDEX idx_matches_date ON matches(match_date);
```

### 8. match_participants
**Purpose**: Players participating in matches

```sql
CREATE TABLE match_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- Team assignment
    team VARCHAR(10) CHECK (team IN ('team_a', 'team_b', 'unassigned')),
    position VARCHAR(50), -- 'Goalkeeper', 'Defender', 'Midfielder', 'Forward'
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined', 'removed')),
    
    -- Performance stats (filled after match)
    goals INTEGER DEFAULT 0,
    assists INTEGER DEFAULT 0,
    rating DECIMAL(3, 2), -- Post-match rating
    
    -- Timestamps
    invited_at TIMESTAMP,
    joined_at TIMESTAMP DEFAULT NOW(),
    confirmed_at TIMESTAMP,
    
    UNIQUE(match_id, user_id)
);

CREATE INDEX idx_match_participants_match_id ON match_participants(match_id);
CREATE INDEX idx_match_participants_user_id ON match_participants(user_id);
CREATE INDEX idx_match_participants_status ON match_participants(status);
```

### 9. payments
**Purpose**: Payment transaction records

```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- Payment details
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('booking', 'deposit', 'refund', 'fee')),
    payment_method VARCHAR(50), -- 'card', 'bank_transfer', 'wallet', etc.
    
    -- Payment gateway
    stripe_payment_intent_id VARCHAR(255),
    stripe_charge_id VARCHAR(255),
    stripe_refund_id VARCHAR(255),
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'disputed')),
    
    -- Split payment
    is_split BOOLEAN DEFAULT FALSE,
    split_with JSONB, -- [{"user_id": "...", "amount": 50.00}, ...]
    
    -- Additional data
    metadata JSONB,
    failure_reason TEXT,
    
    -- Timestamps
    paid_at TIMESTAMP,
    refunded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_stripe_intent ON payments(stripe_payment_intent_id);
```

### 10. reviews
**Purpose**: User reviews for pitches

```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pitch_id UUID NOT NULL REFERENCES pitches(id),
    user_id UUID NOT NULL REFERENCES users(id),
    booking_id UUID REFERENCES bookings(id),
    
    -- Review content
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    
    -- Detailed ratings
    rating_facility INTEGER CHECK (rating_facility >= 1 AND rating_facility <= 5),
    rating_surface INTEGER CHECK (rating_surface >= 1 AND rating_surface <= 5),
    rating_location INTEGER CHECK (rating_location >= 1 AND rating_location <= 5),
    rating_value INTEGER CHECK (rating_value >= 1 AND rating_value <= 5),
    
    -- Media
    images JSONB DEFAULT '[]'::jsonb,
    
    -- Engagement
    helpful_count INTEGER DEFAULT 0,
    not_helpful_count INTEGER DEFAULT 0,
    
    -- Owner response
    owner_response TEXT,
    owner_responded_at TIMESTAMP,
    
    -- Moderation
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('pending', 'published', 'flagged', 'removed')),
    flagged_reason TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(pitch_id, user_id, booking_id)
);

CREATE INDEX idx_reviews_pitch_id ON reviews(pitch_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_status ON reviews(status);
```

### 11. review_helpfulness
**Purpose**: Track helpful votes on reviews

```sql
CREATE TABLE review_helpfulness (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    is_helpful BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(review_id, user_id)
);

CREATE INDEX idx_review_helpfulness_review_id ON review_helpfulness(review_id);
```

### 12. notifications
**Purpose**: User notifications

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification content
    type VARCHAR(50) NOT NULL, -- 'booking_confirmed', 'match_invitation', 'payment_received', etc.
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Related entities
    related_type VARCHAR(50), -- 'booking', 'match', 'payment', 'review'
    related_id UUID,
    
    -- Delivery channels
    sent_push BOOLEAN DEFAULT FALSE,
    sent_email BOOLEAN DEFAULT FALSE,
    sent_sms BOOLEAN DEFAULT FALSE,
    
    -- Status
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    
    -- Priority
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    
    -- Metadata
    action_url VARCHAR(500),
    metadata JSONB,
    
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
```

### 13. messages
**Purpose**: In-app messaging between users

```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES users(id),
    receiver_id UUID NOT NULL REFERENCES users(id),
    
    -- Message content
    subject VARCHAR(255),
    body TEXT NOT NULL,
    
    -- Related to
    related_type VARCHAR(50), -- 'booking', 'match', 'review'
    related_id UUID,
    
    -- Status
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    archived_by_sender BOOLEAN DEFAULT FALSE,
    archived_by_receiver BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_read ON messages(read);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
```

### 14. user_favorites
**Purpose**: User favorite pitches

```sql
CREATE TABLE user_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pitch_id UUID NOT NULL REFERENCES pitches(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id, pitch_id)
);

CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_pitch_id ON user_favorites(pitch_id);
```

### 15. user_follows
**Purpose**: User following system

```sql
CREATE TABLE user_follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

CREATE INDEX idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX idx_user_follows_following ON user_follows(following_id);
```

### 16. activity_log
**Purpose**: Track user activities for feed and analytics

```sql
CREATE TABLE activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- Activity details
    activity_type VARCHAR(50) NOT NULL, -- 'booking_created', 'match_joined', 'review_posted', etc.
    description TEXT,
    
    -- Related entities
    related_type VARCHAR(50),
    related_id UUID,
    
    -- Visibility
    is_public BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    metadata JSONB,
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX idx_activity_log_type ON activity_log(activity_type);
CREATE INDEX idx_activity_log_created ON activity_log(created_at DESC);
CREATE INDEX idx_activity_log_public ON activity_log(is_public);
```

### 17. vouchers
**Purpose**: Discount codes and gift cards

```sql
CREATE TABLE vouchers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    
    -- Voucher type
    type VARCHAR(20) NOT NULL CHECK (type IN ('discount', 'gift_card', 'promotion')),
    
    -- Value
    discount_type VARCHAR(20) CHECK (discount_type IN ('percentage', 'fixed_amount')),
    discount_value DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Constraints
    min_purchase_amount DECIMAL(10, 2),
    max_discount_amount DECIMAL(10, 2),
    
    -- Usage limits
    usage_limit INTEGER, -- NULL for unlimited
    times_used INTEGER DEFAULT 0,
    per_user_limit INTEGER DEFAULT 1,
    
    -- Validity
    valid_from TIMESTAMP,
    valid_until TIMESTAMP,
    
    -- Status
    active BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    description TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_vouchers_code ON vouchers(code);
CREATE INDEX idx_vouchers_active ON vouchers(active);
CREATE INDEX idx_vouchers_valid ON vouchers(valid_from, valid_until);
```

### 18. voucher_usage
**Purpose**: Track voucher redemptions

```sql
CREATE TABLE voucher_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    voucher_id UUID NOT NULL REFERENCES vouchers(id),
    user_id UUID NOT NULL REFERENCES users(id),
    booking_id UUID REFERENCES bookings(id),
    
    discount_amount DECIMAL(10, 2) NOT NULL,
    used_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_voucher_usage_voucher_id ON voucher_usage(voucher_id);
CREATE INDEX idx_voucher_usage_user_id ON voucher_usage(user_id);
```

## Functions and Triggers

### Update timestamps
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_player_profiles_updated_at BEFORE UPDATE ON player_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pitch_owners_updated_at BEFORE UPDATE ON pitch_owners 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pitches_updated_at BEFORE UPDATE ON pitches 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Update statistics on review creation
```sql
CREATE OR REPLACE FUNCTION update_pitch_rating_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'published' THEN
        UPDATE pitches 
        SET 
            total_reviews = total_reviews + 1,
            average_rating = (
                SELECT AVG(rating)::DECIMAL(3,2)
                FROM reviews
                WHERE pitch_id = NEW.pitch_id AND status = 'published'
            )
        WHERE id = NEW.pitch_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pitch_stats_on_review 
    AFTER INSERT ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_pitch_rating_stats();
```

## Indexes Summary

Key indexes for optimal query performance:
- Geospatial indexes for location-based searches
- Composite indexes for common query patterns
- Unique indexes to prevent duplicate records
- Partial indexes for status-based queries

## Data Retention Policy

- **Active bookings**: Indefinite
- **Completed bookings**: 2 years
- **Activity logs**: 1 year
- **Notifications**: 90 days after read, 180 days if unread
- **Deleted users**: Soft delete, purge after 90 days

## Backup Strategy

- **Full backup**: Daily at 2 AM UTC
- **Incremental backup**: Every 6 hours
- **Retention**: 30 days for full backups, 7 days for incremental
- **Test restore**: Monthly

## Performance Considerations

1. **Connection pooling**: Use pgBouncer with max 100 connections
2. **Query optimization**: Monitor slow queries (>100ms)
3. **Caching**: Cache frequently accessed data in Redis
4. **Partitioning**: Consider partitioning large tables by date (bookings, activity_log)
5. **Read replicas**: For reporting and analytics queries

## Security

1. **Encryption at rest**: Enable transparent data encryption
2. **Encryption in transit**: Use SSL/TLS for all connections
3. **Access control**: Row-level security policies for multi-tenancy
4. **Audit logging**: Track all DDL changes and sensitive data access
5. **Regular updates**: Keep PostgreSQL and extensions updated
