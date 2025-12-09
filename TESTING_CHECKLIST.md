# Testing Checklist - Proper Soccer Matcher

This checklist helps verify that all features are working correctly after backend integration.

## ✅ Pre-Testing Setup

- [ ] Docker services are running (`docker ps` shows 5 containers)
- [ ] Backend is accessible at http://localhost:3000/api/v1
- [ ] Frontend is accessible at http://localhost:3001
- [ ] Database has migrations applied
- [ ] Environment variables are configured (`.env` files)

---

## 🔐 Authentication & Authorization

### Registration
- [ ] Can register as a player
- [ ] Can register as a pitch owner
- [ ] Email validation works (valid format required)
- [ ] Password validation works (min 8 chars, uppercase, lowercase, number)
- [ ] Duplicate email shows error
- [ ] Successful registration redirects to dashboard
- [ ] JWT tokens are stored in localStorage

### Login
- [ ] Can login with valid credentials
- [ ] Invalid credentials show error
- [ ] Login redirects to correct dashboard (player vs pitch owner)
- [ ] "Remember me" checkbox works
- [ ] Logout clears tokens and redirects to home

### Password Reset
- [ ] Can request password reset email
- [ ] Reset link in email works
- [ ] Can set new password with reset token
- [ ] Invalid/expired token shows error
- [ ] After reset, can login with new password

### Token Management
- [ ] Access token is added to API requests
- [ ] Expired token triggers refresh
- [ ] Invalid token redirects to login
- [ ] Refresh token works correctly

---

## ⚽ Pitch Discovery & Search

### Browse Pitches
- [ ] Pitch list page loads with pitches
- [ ] Pitch cards show correct data (name, price, rating, location)
- [ ] Images display correctly
- [ ] "View Details" button works

### Search Functionality
- [ ] Location/city search filters results
- [ ] Surface type filter works (grass, artificial, indoor, hybrid)
- [ ] Size filter works (5-a-side, 7-a-side, 11-a-side)
- [ ] Price range slider filters correctly
- [ ] Date picker filters available pitches
- [ ] Multiple filters work together
- [ ] Clear filters button resets search

### Sorting
- [ ] Sort by price (low to high)
- [ ] Sort by price (high to low)
- [ ] Sort by rating
- [ ] Sort by distance (if location enabled)

### Pitch Details
- [ ] Single pitch page loads
- [ ] All pitch information displays correctly
- [ ] Image gallery/carousel works
- [ ] Facilities list is shown
- [ ] Owner information displays
- [ ] Reviews section loads
- [ ] Availability calendar shows correct dates
- [ ] "Book Now" button is visible

### Map View
- [ ] Map displays with pitch markers
- [ ] Clicking marker shows pitch info
- [ ] Map filters sync with list filters
- [ ] "View on map" from pitch card works

---

## 📅 Booking System

### Create Booking
- [ ] Can select date from calendar
- [ ] Available time slots show correctly
- [ ] Unavailable slots are disabled
- [ ] Selected slot highlights correctly
- [ ] Booking summary shows correct details
- [ ] Total price calculates correctly
- [ ] Can add player count
- [ ] Can add booking notes

### Payment Integration
- [ ] Stripe payment form loads
- [ ] Can enter test card details (4242 4242 4242 4242)
- [ ] Card validation works (expiry, CVC)
- [ ] Payment processing shows loading state
- [ ] Successful payment creates booking
- [ ] Payment failure shows error
- [ ] Booking confirmation page displays

### My Bookings (Player)
- [ ] Bookings list loads for logged-in player
- [ ] Can filter by status (upcoming, completed, cancelled)
- [ ] Can filter by date range
- [ ] Booking cards show correct information
- [ ] "View Details" opens booking details
- [ ] "Cancel Booking" button shows for upcoming bookings
- [ ] Cancel booking confirmation modal works
- [ ] Cancelled bookings show refund status

### Booking Details
- [ ] All booking information displays
- [ ] Pitch details are shown
- [ ] Date and time are correct
- [ ] Payment status is shown
- [ ] Receipt/invoice can be downloaded
- [ ] QR code for check-in displays (if implemented)

---

## 💼 Business Dashboard (Pitch Owners)

### Pitch Management
- [ ] Can view list of owned pitches
- [ ] "Add New Pitch" button works
- [ ] Create pitch form validates correctly
- [ ] Image upload works (if implemented)
- [ ] Can edit pitch details
- [ ] Can delete pitch (with confirmation)
- [ ] Pitch status toggle works (active/inactive)

### Booking Management
- [ ] Can view all bookings for owned pitches
- [ ] Bookings show customer information
- [ ] Can filter by pitch, date, status
- [ ] Can mark booking as completed
- [ ] Can cancel bookings (with refund)
- [ ] Export bookings to CSV works (if implemented)

### Revenue & Analytics
- [ ] Revenue dashboard loads
- [ ] Total revenue displays correctly
- [ ] Revenue chart shows data
- [ ] Booking statistics are accurate
- [ ] Top performing pitches shown
- [ ] Date range filter works

### Availability Management
- [ ] Can set pitch operating hours
- [ ] Can block specific time slots
- [ ] Can set recurring unavailability
- [ ] Changes reflect in public availability

---

## 👤 User Profile

### View Profile
- [ ] Profile page loads with user data
- [ ] Avatar/photo displays
- [ ] Personal information is correct
- [ ] Stats display for players (bookings, spent)
- [ ] Stats display for owners (pitches, revenue)

### Edit Profile
- [ ] Can update first name
- [ ] Can update last name
- [ ] Can update phone number
- [ ] Can update bio
- [ ] Can upload new profile photo
- [ ] Changes save correctly
- [ ] Validation errors show for invalid data

### Change Password
- [ ] Current password validation works
- [ ] New password must meet requirements
- [ ] Confirm password must match
- [ ] Successful change shows confirmation
- [ ] Can login with new password

---

## 💳 Payment Methods

### Add Payment Method
- [ ] Add card form loads
- [ ] Stripe Elements render correctly
- [ ] Card brand detection works (Visa, Mastercard, etc.)
- [ ] Can save card for future use
- [ ] Card appears in saved methods
- [ ] Validation errors display

### Manage Payment Methods
- [ ] Saved cards list displays
- [ ] Can set default card
- [ ] Can delete card
- [ ] Card details are masked (last 4 digits only)

---

## ⭐ Reviews & Ratings

### Leave Review
- [ ] Review form shows after completed booking
- [ ] Star rating selector works
- [ ] Comment textarea accepts input
- [ ] Can rate different aspects (facilities, location, value)
- [ ] Submit review works
- [ ] Review appears on pitch page
- [ ] Cannot review same booking twice

### View Reviews
- [ ] Reviews load on pitch detail page
- [ ] Pagination works
- [ ] Can sort by rating or date
- [ ] Average rating calculates correctly
- [ ] Review cards show user name and date
- [ ] "Verified Booking" badge shows

---

## 🔔 Notifications

### In-App Notifications
- [ ] Notification icon shows count
- [ ] Clicking opens notifications panel
- [ ] Notifications list loads
- [ ] Can mark as read
- [ ] Can mark all as read
- [ ] Can delete notification
- [ ] Different notification types display correctly

### Email Notifications
- [ ] Booking confirmation email received
- [ ] Booking cancellation email received
- [ ] Payment receipt email received
- [ ] Password reset email received
- [ ] Welcome email received after registration

---

## 🔍 Edge Cases & Error Handling

### Network Errors
- [ ] Shows error message when backend is down
- [ ] Shows retry button
- [ ] Loading states show correctly
- [ ] Timeout errors handled gracefully

### Form Validation
- [ ] Required fields show error when empty
- [ ] Invalid email format shows error
- [ ] Date in past shows error for bookings
- [ ] Price must be positive number
- [ ] Max length validation works

### Authorization
- [ ] Non-authenticated users redirected to login
- [ ] Players cannot access business dashboard
- [ ] Owners cannot book their own pitches
- [ ] Cannot edit others' resources

### Race Conditions
- [ ] Double-booking same slot prevented
- [ ] Concurrent edits handled correctly
- [ ] Payment idempotency works

---

## 📱 Responsive Design

### Mobile (320px - 768px)
- [ ] Navigation menu works on mobile
- [ ] Forms are usable on small screens
- [ ] Tables adapt to mobile view
- [ ] Images scale correctly
- [ ] Touch targets are large enough

### Tablet (768px - 1024px)
- [ ] Layout adapts to tablet screen
- [ ] Sidebar/navigation works correctly
- [ ] Charts and graphs are readable

### Desktop (1024px+)
- [ ] Full layout displays correctly
- [ ] All features accessible
- [ ] No horizontal scrolling

---

## ⚡ Performance

### Page Load Times
- [ ] Homepage loads in < 2 seconds
- [ ] Search results load in < 1 second
- [ ] Dashboard loads in < 2 seconds
- [ ] No console errors on load

### API Response Times
- [ ] Authentication endpoints respond in < 500ms
- [ ] Search endpoints respond in < 1s
- [ ] Booking creation responds in < 2s (including payment)

### Caching
- [ ] Pitch list caches correctly
- [ ] Images load from cache on repeat visits
- [ ] API responses use cache when appropriate

---

## 🔒 Security

### Input Sanitization
- [ ] XSS attacks prevented (script tags in input)
- [ ] SQL injection prevented
- [ ] HTML injection prevented

### Authentication Security
- [ ] JWT tokens expire correctly
- [ ] Refresh tokens work only once
- [ ] Tokens invalidated on logout
- [ ] HTTPS enforced in production

### Data Privacy
- [ ] Passwords are hashed (never plain text)
- [ ] Card details not stored (Stripe handles)
- [ ] Personal data protected
- [ ] GDPR compliance (delete account works)

---

## 🚀 Production Readiness

### Environment Configuration
- [ ] Production API URL configured
- [ ] Production Stripe keys set
- [ ] Database connection secure
- [ ] SSL certificates valid

### Monitoring
- [ ] Error tracking works (Sentry, etc.)
- [ ] Performance monitoring active
- [ ] Logging configured correctly
- [ ] Alerts set up for critical errors

### Backups
- [ ] Database backups automated
- [ ] Backup restoration tested
- [ ] File uploads backed up

---

## Test Results Summary

**Date Tested:** _______________

**Tested By:** _______________

**Environment:** ☐ Development  ☐ Staging  ☐ Production

**Overall Status:**
- Total Tests: _____ / _____
- Passed: _____
- Failed: _____
- Blocked: _____

**Critical Issues Found:**
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

**Notes:**
___________________________________________________
___________________________________________________
___________________________________________________

---

## Quick Test Commands

```powershell
# Health check
Invoke-WebRequest http://localhost:3000/api/v1/health

# Test registration
$body = @{
    email = "test@example.com"
    password = "Test123!"
    firstName = "Test"
    lastName = "User"
    role = "player"
} | ConvertTo-Json
Invoke-WebRequest -Uri http://localhost:3000/api/v1/auth/register -Method POST -Body $body -ContentType "application/json"

# Test login
$body = @{
    email = "test@example.com"
    password = "Test123!"
} | ConvertTo-Json
Invoke-WebRequest -Uri http://localhost:3000/api/v1/auth/login -Method POST -Body $body -ContentType "application/json"

# Test pitch search
Invoke-WebRequest "http://localhost:3000/api/v1/pitches?city=London&limit=5"
```
