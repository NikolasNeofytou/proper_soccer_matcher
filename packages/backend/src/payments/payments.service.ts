import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Payment, PaymentStatus, PaymentMethod } from './entities/payment.entity';
import { 
  Booking, 
  BookingStatus,
  PaymentStatus as BookingPaymentStatus 
} from '../bookings/entities/booking.entity';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { CreateRefundDto } from './dto/create-refund.dto';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    private configService: ConfigService,
  ) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeSecretKey || stripeSecretKey.includes('your_')) {
      console.warn('⚠️  Stripe secret key not configured. Payment functionality will be limited.');
      // Initialize with a dummy key for development
      this.stripe = new Stripe('sk_test_dummy', { apiVersion: '2025-10-29.clover' });
    } else {
      this.stripe = new Stripe(stripeSecretKey, { apiVersion: '2025-10-29.clover' });
    }
  }

  async createPaymentIntent(
    userId: string,
    createPaymentIntentDto: CreatePaymentIntentDto,
  ): Promise<{ clientSecret: string; payment: Payment }> {
    const { bookingId, paymentMethodId } = createPaymentIntentDto;

    // Get booking
    const booking = await this.bookingsRepository.findOne({
      where: { id: bookingId },
      relations: ['pitch'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }

    // Verify user owns this booking
    if (booking.userId !== userId) {
      throw new ForbiddenException('You can only pay for your own bookings');
    }

    // Check if booking is already paid
    if (booking.paymentStatus === 'paid') {
      throw new BadRequestException('This booking has already been paid');
    }

    // Check if payment already exists
    const existingPayment = await this.paymentsRepository.findOne({
      where: { bookingId, status: PaymentStatus.SUCCEEDED },
    });

    if (existingPayment) {
      throw new BadRequestException('Payment already exists for this booking');
    }

    // Create Stripe payment intent
    const amount = Math.round(booking.totalAmount * 100); // Convert to cents
    
    let paymentIntent: Stripe.PaymentIntent;
    try {
      paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency: booking.currency.toLowerCase(),
        payment_method: paymentMethodId,
        automatic_payment_methods: paymentMethodId ? undefined : { enabled: true },
        metadata: {
          bookingId: booking.id,
          userId,
          pitchId: booking.pitchId,
        },
      });
    } catch (error) {
      console.error('Stripe payment intent creation error:', error);
      throw new BadRequestException('Failed to create payment intent');
    }

    // Create payment record
    const payment = this.paymentsRepository.create({
      userId,
      bookingId,
      amount: booking.totalAmount,
      currency: booking.currency,
      paymentMethod: PaymentMethod.CARD,
      status: PaymentStatus.PENDING,
      stripePaymentIntentId: paymentIntent.id,
      description: `Payment for booking ${booking.id}`,
    });

    await this.paymentsRepository.save(payment);

    // Update booking with payment intent ID
    await this.bookingsRepository.update(bookingId, {
      paymentIntentId: paymentIntent.id,
    });

    return {
      clientSecret: paymentIntent.client_secret!,
      payment,
    };
  }

  async confirmPayment(paymentIntentId: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { stripePaymentIntentId: paymentIntentId },
      relations: ['booking'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Get payment intent from Stripe
    let paymentIntent: Stripe.PaymentIntent;
    try {
      paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      console.error('Stripe payment intent retrieval error:', error);
      throw new BadRequestException('Failed to retrieve payment status');
    }

    // Update payment status
    if (paymentIntent.status === 'succeeded') {
      await this.paymentsRepository.update(payment.id, {
        status: PaymentStatus.SUCCEEDED,
        succeededAt: new Date(),
        stripeChargeId: paymentIntent.latest_charge as string,
      });

      // Update booking payment status and confirm booking
      await this.bookingsRepository.update(payment.bookingId, {
        paymentStatus: BookingPaymentStatus.PAID,
        status: BookingStatus.CONFIRMED,
        confirmedAt: new Date(),
      });
    } else if (paymentIntent.status === 'processing') {
      await this.paymentsRepository.update(payment.id, {
        status: PaymentStatus.PROCESSING,
      });
    } else if (paymentIntent.status === 'requires_payment_method') {
      await this.paymentsRepository.update(payment.id, {
        status: PaymentStatus.FAILED,
        failedAt: new Date(),
        failureMessage: 'Payment method required',
      });
    } else {
      await this.paymentsRepository.update(payment.id, {
        status: PaymentStatus.FAILED,
        failedAt: new Date(),
        failureMessage: paymentIntent.last_payment_error?.message || 'Payment failed',
      });
    }

    return this.paymentsRepository.findOne({
      where: { id: payment.id },
      relations: ['booking'],
    }) as Promise<Payment>;
  }

  async createRefund(userId: string, createRefundDto: CreateRefundDto): Promise<Payment> {
    const { paymentId, amount, reason } = createRefundDto;

    const payment = await this.paymentsRepository.findOne({
      where: { id: paymentId },
      relations: ['booking', 'booking.pitch'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Verify user has permission (either booking owner or pitch owner)
    if (payment.userId !== userId && payment.booking.pitch.ownerId !== userId) {
      throw new ForbiddenException('You do not have permission to refund this payment');
    }

    if (payment.status !== PaymentStatus.SUCCEEDED) {
      throw new BadRequestException('Only successful payments can be refunded');
    }

    // Calculate refund amount
    const refundAmount = amount || payment.amount - payment.refundedAmount;

    if (refundAmount <= 0) {
      throw new BadRequestException('Invalid refund amount');
    }

    if (refundAmount > payment.amount - payment.refundedAmount) {
      throw new BadRequestException('Refund amount exceeds available amount');
    }

    // Create Stripe refund
    let refund: Stripe.Refund;
    try {
      refund = await this.stripe.refunds.create({
        payment_intent: payment.stripePaymentIntentId,
        amount: Math.round(refundAmount * 100), // Convert to cents
        reason: 'requested_by_customer',
        metadata: {
          reason: reason || 'No reason provided',
        },
      });
    } catch (error) {
      console.error('Stripe refund creation error:', error);
      throw new BadRequestException('Failed to create refund');
    }

    // Update payment record
    const newRefundedAmount = payment.refundedAmount + refundAmount;
    const refundIds = [...(payment.refundIds || []), refund.id];
    
    const newStatus =
      newRefundedAmount >= payment.amount
        ? PaymentStatus.REFUNDED
        : PaymentStatus.PARTIALLY_REFUNDED;

    await this.paymentsRepository.update(paymentId, {
      refundedAmount: newRefundedAmount,
      refundIds,
      refundedAt: new Date(),
      status: newStatus,
    });

    // Update booking
    await this.bookingsRepository.update(payment.bookingId, {
      paymentStatus: newStatus === PaymentStatus.REFUNDED 
        ? BookingPaymentStatus.REFUNDED 
        : BookingPaymentStatus.PAID,
      refundAmount: newRefundedAmount,
      refundId: refund.id,
    });

    return this.paymentsRepository.findOne({
      where: { id: paymentId },
      relations: ['booking'],
    }) as Promise<Payment>;
  }

  async findByUser(userId: string): Promise<Payment[]> {
    return this.paymentsRepository.find({
      where: { userId },
      relations: ['booking', 'booking.pitch'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { id },
      relations: ['booking', 'booking.pitch'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Verify user has access
    if (payment.userId !== userId && payment.booking.pitch.ownerId !== userId) {
      throw new ForbiddenException('You do not have permission to view this payment');
    }

    return payment;
  }

  async handleWebhook(signature: string, rawBody: Buffer): Promise<void> {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    
    if (!webhookSecret || webhookSecret.includes('your_')) {
      console.warn('⚠️  Stripe webhook secret not configured. Skipping webhook verification.');
      return;
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      throw new BadRequestException(`Webhook signature verification failed: ${err.message}`);
    }

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      case 'charge.refunded':
        await this.handleChargeRefunded(event.data.object as Stripe.Charge);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    await this.confirmPayment(paymentIntent.id);
  }

  private async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const payment = await this.paymentsRepository.findOne({
      where: { stripePaymentIntentId: paymentIntent.id },
    });

    if (payment) {
      await this.paymentsRepository.update(payment.id, {
        status: PaymentStatus.FAILED,
        failedAt: new Date(),
        failureMessage: paymentIntent.last_payment_error?.message || 'Payment failed',
      });
    }
  }

  private async handleChargeRefunded(charge: Stripe.Charge): Promise<void> {
    const payment = await this.paymentsRepository.findOne({
      where: { stripeChargeId: charge.id },
    });

    if (payment) {
      const refundedAmount = charge.amount_refunded / 100; // Convert from cents
      const status =
        refundedAmount >= payment.amount
          ? PaymentStatus.REFUNDED
          : PaymentStatus.PARTIALLY_REFUNDED;

      await this.paymentsRepository.update(payment.id, {
        refundedAmount,
        status,
        refundedAt: new Date(),
      });
    }
  }
}
