# Uber-Style Payment System for Greek Market

## Overview
This payment system follows the **Uber model** - users save their payment method once and are automatically charged after the service is completed. This provides a seamless, frictionless booking experience perfect for the Greek market.

## Key Features

### 1. **Save Once, Use Forever**
- Users add their payment method to their account
- No need to enter card details for every booking
- Support for multiple payment methods
- Set a default payment method

### 2. **Post-Service Charging (Uber Model)**
```
User Flow:
1. Save payment method → 2. Book pitch → 3. Play → 4. Auto-charge → 5. Receive receipt
```

**NOT:**
```
Old Flow:
1. Select pitch → 2. Enter card → 3. Pay upfront → 4. Play
```

### 3. **Automatic Charging**
- Charge happens automatically after the booking time completes
- No manual payment action required
- Failed payment → Automatic retry + notification

### 4. **Instant Digital Receipts**
- Emailed immediately after payment
- VAT (ΦΠΑ) compliant for Greek tax law
- PDF download available in app
- Greek language receipts

### 5. **Seamless Refunds**
- Cancel 24+ hours before → Automatic full refund
- Cancel <24 hours → Partial refund (configurable)
- Refund processed to original payment method
- No manual refund request needed

## Greek Market Specifics

### Supported Payment Methods
1. **Credit/Debit Cards**
   - Visa
   - Mastercard
   - American Express
   - Greek bank cards (Alpha Bank, Eurobank, Piraeus, National Bank, etc.)

2. **Digital Wallets** (Future)
   - Google Pay
   - Apple Pay
   - PayPal

3. **Cash** (Optional - for businesses that prefer)
   - Pay at venue
   - Marked as "cash payment" in system

### Tax Compliance (Greek Law)
```typescript
Receipt Requirements:
- ΑΦΜ (VAT Number): Required
- ΦΠΑ (VAT): 24% clearly shown
- AADE Integration: Ready for MyDATA
- Receipt Number: Sequential, traceable
- Business Details: Full address, VAT, phone
- Customer Details: Name, email (optional VAT)
```

### Currency
- **EUR (€)** - All prices in Euros
- Greek formatting: 50,00 € or €50.00

## Payment Flow Architecture

### 1. Add Payment Method
```typescript
POST /api/v1/payments/methods
Body: { token: "stripe_token_..." }
Response: {
  id: "pm_123",
  type: "card",
  brand: "visa",
  last4: "4242",
  isDefault: true
}
```

### 2. Create Booking (No immediate charge)
```typescript
POST /api/v1/bookings
Body: {
  pitchId: "...",
  date: "2025-12-10",
  startTime: "18:00",
  endTime: "19:00"
}
Response: {
  booking: { id: "...", status: "confirmed" },
  paymentIntent: { 
    id: "...", 
    status: "requires_confirmation",
    amount: 55.00
  }
}
```

**Note:** Booking is confirmed immediately, payment processed later

### 3. Auto-Charge (After booking completed)
```typescript
// Triggered by cron job 10 minutes after endTime
POST /api/v1/payments/charge (Internal)
Body: { bookingId: "..." }

Process:
1. Get booking details
2. Get user's default payment method
3. Charge via Stripe
4. Update booking.paymentStatus = "paid"
5. Generate receipt
6. Email receipt to user
7. Send push notification: "Payment successful!"
```

### 4. Failed Payment Handling
```typescript
If payment fails:
1. Retry after 1 hour
2. Retry after 6 hours
3. Retry after 24 hours
4. If all fail → Send email: "Please update payment method"
5. Mark booking.paymentStatus = "failed"
6. Add late fee (configurable)
```

### 5. Refund (For cancellations)
```typescript
POST /api/v1/payments/refunds
Body: {
  bookingId: "...",
  reason: "User cancelled"
}

Logic:
- If cancelled >24h before → 100% refund
- If cancelled <24h before → 50% refund
- If no-show → 0% refund
- Refund processed automatically to payment method
```

## Database Schema

### payment_methods table
```sql
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(50), -- card, paypal, google_pay, apple_pay
  provider VARCHAR(50), -- stripe, paypal
  provider_payment_method_id VARCHAR(255),
  
  -- Card details (if type = card)
  brand VARCHAR(50),
  last4 VARCHAR(4),
  expiry_month INTEGER,
  expiry_year INTEGER,
  
  -- PayPal details (if type = paypal)
  email VARCHAR(255),
  
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payment_methods_user ON payment_methods(user_id);
```

### transactions table
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id),
  user_id UUID REFERENCES users(id),
  payment_method_id UUID REFERENCES payment_methods(id),
  
  amount DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'EUR',
  type VARCHAR(20), -- charge, refund
  status VARCHAR(20), -- pending, completed, failed
  
  provider VARCHAR(50), -- stripe, paypal
  provider_transaction_id VARCHAR(255),
  
  description TEXT,
  receipt_number VARCHAR(50) UNIQUE,
  receipt_url TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP
);

CREATE INDEX idx_transactions_booking ON transactions(booking_id);
CREATE INDEX idx_transactions_user ON transactions(user_id);
```

### receipts table
```sql
CREATE TABLE receipts (
  id UUID PRIMARY KEY,
  transaction_id UUID REFERENCES transactions(id),
  booking_id UUID REFERENCES bookings(id),
  
  receipt_number VARCHAR(50) UNIQUE,
  issue_date DATE,
  
  -- Business (pitch owner)
  business_name VARCHAR(255),
  business_vat VARCHAR(50),
  business_address TEXT,
  
  -- Customer
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_vat VARCHAR(50), -- Optional
  
  -- Itemization
  items JSONB, -- [{ description, quantity, unitPrice, total }]
  subtotal DECIMAL(10, 2),
  vat_rate DECIMAL(5, 2), -- 24% for Greece
  vat_amount DECIMAL(10, 2),
  total DECIMAL(10, 2),
  
  currency VARCHAR(3) DEFAULT 'EUR',
  pdf_url TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_receipts_booking ON receipts(booking_id);
```

## Backend Implementation (NestJS)

### PaymentsService
```typescript
@Injectable()
export class PaymentsService {
  constructor(
    @InjectStripe() private stripe: Stripe,
    @InjectRepository(PaymentMethod)
    private paymentMethodsRepo: Repository<PaymentMethod>,
    @InjectRepository(Transaction)
    private transactionsRepo: Repository<Transaction>,
    private mailService: MailService,
  ) {}

  // Called by cron job after booking ends
  async chargeBooking(bookingId: string): Promise<Transaction> {
    const booking = await this.bookingsService.findOne(bookingId);
    const paymentMethod = await this.getDefaultPaymentMethod(booking.userId);
    
    try {
      const charge = await this.stripe.paymentIntents.create({
        amount: booking.totalAmount * 100, // Convert to cents
        currency: 'eur',
        customer: paymentMethod.stripeCustomerId,
        payment_method: paymentMethod.stripePaymentMethodId,
        confirm: true,
        description: `Booking ${booking.id} - ${booking.pitch.name}`,
      });

      const transaction = await this.transactionsRepo.save({
        bookingId,
        userId: booking.userId,
        paymentMethodId: paymentMethod.id,
        amount: booking.totalAmount,
        type: 'charge',
        status: 'completed',
        provider: 'stripe',
        providerTransactionId: charge.id,
      });

      // Generate receipt
      await this.generateReceipt(transaction.id);
      
      // Send email
      await this.mailService.sendReceipt(booking.user.email, transaction.id);
      
      return transaction;
    } catch (error) {
      // Handle payment failure
      await this.handlePaymentFailure(bookingId, error);
      throw error;
    }
  }

  async requestRefund(bookingId: string, reason: string): Promise<Transaction> {
    const booking = await this.bookingsService.findOne(bookingId);
    const originalCharge = await this.findChargeByBooking(bookingId);
    
    const refundAmount = this.calculateRefundAmount(booking);
    
    const refund = await this.stripe.refunds.create({
      payment_intent: originalCharge.providerTransactionId,
      amount: refundAmount * 100,
      reason: 'requested_by_customer',
    });

    return await this.transactionsRepo.save({
      bookingId,
      userId: booking.userId,
      amount: refundAmount,
      type: 'refund',
      status: 'completed',
      provider: 'stripe',
      providerTransactionId: refund.id,
      description: reason,
    });
  }
}
```

### Cron Job (Auto-charge)
```typescript
@Injectable()
export class PaymentScheduler {
  constructor(private paymentsService: PaymentsService) {}

  // Run every 10 minutes
  @Cron('*/10 * * * *')
  async processCompletedBookings() {
    const completedBookings = await this.bookingsService.findCompletedUnpaid();
    
    for (const booking of completedBookings) {
      try {
        await this.paymentsService.chargeBooking(booking.id);
        console.log(`✅ Charged booking ${booking.id}`);
      } catch (error) {
        console.error(`❌ Failed to charge booking ${booking.id}`, error);
      }
    }
  }
}
```

## User Experience

### Booking Flow
```
1. User opens app → Sees pitches
2. Selects pitch + date/time
3. Clicks "Confirm Booking"
4. ✅ Booking confirmed instantly!
5. Shows: "You'll be charged €55 after your booking"
6. User plays soccer
7. 10 mins after end time → Auto-charged
8. Email: "Payment successful! Here's your receipt"
9. Push notification: "€55 charged to Visa •••• 4242"
```

### First Time Flow
```
1. User tries to book (no payment method saved)
2. Redirect to "Add Payment Method" page
3. User adds card (Stripe Elements)
4. Card saved → Return to booking
5. Complete booking
```

## Security & Compliance

### PCI Compliance
- ✅ Never store full card numbers
- ✅ Use Stripe Tokens/Elements
- ✅ HTTPS only
- ✅ Encrypted at rest

### GDPR Compliance
- ✅ User can delete payment methods
- ✅ User can export payment history
- ✅ Clear data retention policy

### Greek Tax Law (AADE)
- ✅ VAT (ΦΠΑ) 24% shown on all receipts
- ✅ Sequential receipt numbering
- ✅ Business VAT (ΑΦΜ) displayed
- ✅ Ready for MyDATA integration

## Advantages Over Traditional Payment

| Feature | Uber Model | Traditional |
|---------|-----------|-------------|
| User friction | ⭐⭐⭐⭐⭐ One-click booking | ⭐⭐ Enter card every time |
| Conversion rate | 🔥 Higher | 📉 Lower (abandoned carts) |
| Refunds | ✅ Automatic | ❌ Manual process |
| Failed payments | 🔁 Auto-retry | ❌ Booking lost |
| User trust | 💚 Pay after service | ⚠️ Pay upfront |

## Next Steps

1. **Phase 1: Basic Implementation** ✅
   - Payment methods CRUD
   - Stripe integration
   - Basic charging

2. **Phase 2: Auto-Charging** 🚧
   - Cron job setup
   - Failed payment handling
   - Retry logic

3. **Phase 3: Receipts** 📝
   - Greek VAT compliance
   - PDF generation
   - Email delivery

4. **Phase 4: Advanced** 🚀
   - Multiple currencies
   - Split payments (group bookings)
   - Wallet/balance system
   - Promotional codes

## Testing

### Test Cards (Stripe)
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3DS Auth: 4000 0027 6000 3184
```

### Test Scenarios
1. ✅ Happy path: Add card → Book → Auto-charge → Receipt
2. ❌ Failed payment → Retry → Success
3. 🔙 Cancel booking → Auto-refund
4. 💳 Multiple payment methods → Switch default
5. 📧 Receipt generation → PDF download

---

**Summary:** This Uber-style payment system provides a frictionless experience for Greek users, with automatic charging after service completion, instant refunds, and full tax compliance with Greek law (VAT, AADE, MyDATA ready).
