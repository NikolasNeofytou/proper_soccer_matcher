import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import {
  AssistantConversation,
  AssistantMessage,
  MessageRole,
  ConversationStatus,
} from './entities/assistant.entity';
import { Pitch } from '../pitches/entities/pitch.entity';
import { Booking, BookingStatus } from '../bookings/entities/booking.entity';
import { SendMessageDto, CheckAvailabilityDto } from './dto/assistant.dto';

interface AvailabilitySlot {
  startTime: string;
  endTime: string;
  available: boolean;
  price: number;
}

@Injectable()
export class AssistantService {
  constructor(
    @InjectRepository(AssistantConversation)
    private conversationsRepository: Repository<AssistantConversation>,
    @InjectRepository(AssistantMessage)
    private messagesRepository: Repository<AssistantMessage>,
    @InjectRepository(Pitch)
    private pitchesRepository: Repository<Pitch>,
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
  ) {}

  async sendMessage(userId: string, sendMessageDto: SendMessageDto): Promise<{
    conversation: AssistantConversation;
    messages: AssistantMessage[];
  }> {
    const { message, pitchId, conversationId } = sendMessageDto;

    let conversation: AssistantConversation;

    // Get or create conversation
    if (conversationId) {
      const existing = await this.conversationsRepository.findOne({
        where: { id: conversationId, userId },
      });
      if (!existing) {
        throw new NotFoundException('Conversation not found');
      }
      conversation = existing;
    } else {
      // Create new conversation
      conversation = this.conversationsRepository.create({
        userId,
        pitchId,
        title: message.substring(0, 50),
        status: ConversationStatus.ACTIVE,
      });
      conversation = await this.conversationsRepository.save(conversation);
    }

    // Save user message
    const userMessage = this.messagesRepository.create({
      conversationId: conversation.id,
      role: MessageRole.USER,
      content: message,
    });
    await this.messagesRepository.save(userMessage);

    // Analyze intent and generate response
    const responseContent = await this.generateResponse(message, pitchId, userId);

    // Save assistant response
    const assistantMessage = this.messagesRepository.create({
      conversationId: conversation.id,
      role: MessageRole.ASSISTANT,
      content: responseContent.message,
      metadata: responseContent.metadata,
    });
    await this.messagesRepository.save(assistantMessage);

    // Update conversation
    await this.conversationsRepository.update(conversation.id, {
      messageCount: conversation.messageCount + 2,
      lastMessageAt: new Date(),
    });

    // Get all messages
    const messages = await this.messagesRepository.find({
      where: { conversationId: conversation.id },
      order: { createdAt: 'ASC' },
    });

    return { conversation, messages };
  }

  async getConversation(userId: string, conversationId: string): Promise<{
    conversation: AssistantConversation;
    messages: AssistantMessage[];
  }> {
    const conversation = await this.conversationsRepository.findOne({
      where: { id: conversationId, userId },
      relations: ['pitch'],
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const messages = await this.messagesRepository.find({
      where: { conversationId },
      order: { createdAt: 'ASC' },
    });

    return { conversation, messages };
  }

  async getUserConversations(userId: string): Promise<AssistantConversation[]> {
    return this.conversationsRepository.find({
      where: { userId },
      relations: ['pitch'],
      order: { lastMessageAt: 'DESC' },
    });
  }

  async checkAvailability(checkDto: CheckAvailabilityDto): Promise<{
    pitch: Pitch;
    date: string;
    availableSlots: AvailabilitySlot[];
    message: string;
  }> {
    const { pitchId, date, startTime, endTime } = checkDto;

    const pitch = await this.pitchesRepository.findOne({
      where: { id: pitchId },
    });

    if (!pitch) {
      throw new NotFoundException('Pitch not found');
    }

    // Get bookings for the date
    const bookings = await this.bookingsRepository.find({
      where: {
        pitchId,
        bookingDate: new Date(date),
        status: Between(BookingStatus.PENDING, BookingStatus.CONFIRMED) as any,
      },
    });

    // Generate time slots (8:00 - 22:00 in 2-hour blocks)
    const availableSlots: AvailabilitySlot[] = [];
    const startHour = 8;
    const endHour = 22;

    for (let hour = startHour; hour < endHour; hour += 2) {
      const slotStart = `${hour.toString().padStart(2, '0')}:00`;
      const slotEnd = `${(hour + 2).toString().padStart(2, '0')}:00`;

      // Check if slot conflicts with any booking
      const hasConflict = bookings.some((booking) => {
        return (
          (booking.startTime < slotEnd && booking.endTime > slotStart)
        );
      });

      availableSlots.push({
        startTime: slotStart,
        endTime: slotEnd,
        available: !hasConflict,
        price: pitch.hourlyRate * 2,
      });
    }

    // Generate message
    const availableCount = availableSlots.filter(s => s.available).length;
    let message = `For ${pitch.name} on ${date}, there are ${availableCount} available time slots:\n\n`;
    
    availableSlots.forEach((slot) => {
      if (slot.available) {
        message += `✅ ${slot.startTime} - ${slot.endTime} (${pitch.currency} ${slot.price})\n`;
      }
    });

    if (availableCount === 0) {
      message = `Unfortunately, ${pitch.name} is fully booked on ${date}. Please try another date or check our other available pitches.`;
    }

    return { pitch, date, availableSlots, message };
  }

  private async generateResponse(
    message: string,
    pitchId: string | undefined,
    userId: string,
  ): Promise<{ message: string; metadata: any }> {
    const lowerMessage = message.toLowerCase();

    // Check for availability queries
    if (
      lowerMessage.includes('available') ||
      lowerMessage.includes('availability') ||
      lowerMessage.includes('free') ||
      lowerMessage.includes('book')
    ) {
      if (pitchId) {
        const pitch = await this.pitchesRepository.findOne({
          where: { id: pitchId },
        });

        if (pitch) {
          return {
            message: `I'd be happy to help you check availability for ${pitch.name}! 

To see available time slots, please let me know:
- Which date you're interested in (e.g., "tomorrow" or "December 15th")
- Your preferred time (morning, afternoon, or evening)

You can also use our availability checker to see real-time booking slots.

${pitch.name} Details:
📍 Location: ${pitch.city}, ${pitch.country}
💰 Hourly Rate: ${pitch.currency} ${pitch.hourlyRate}
⚽ Surface: ${pitch.surfaceType}
👥 Capacity: ${pitch.capacity} players
⭐ Rating: ${pitch.averageRating || 'New'}/5

How can I assist you further?`,
            metadata: { intent: 'availability_check', pitchId },
          };
        }
      }

      return {
        message: `I can help you check pitch availability! Please let me know which pitch you're interested in, and I'll show you all available time slots. You can browse our pitches and I'll provide real-time availability information.`,
        metadata: { intent: 'availability_check' },
      };
    }

    // Check for pricing queries
    if (
      lowerMessage.includes('price') ||
      lowerMessage.includes('cost') ||
      lowerMessage.includes('fee') ||
      lowerMessage.includes('how much')
    ) {
      if (pitchId) {
        const pitch = await this.pitchesRepository.findOne({
          where: { id: pitchId },
        });

        if (pitch) {
          return {
            message: `Pricing for ${pitch.name}:

💰 Hourly Rate: ${pitch.currency} ${pitch.hourlyRate}
📅 Minimum Booking: 1 hour
⏰ Cancellation: Free cancellation up to ${pitch.minCancellationHours} hours before booking

For longer bookings, the total cost is calculated based on the duration:
- 2 hours: ${pitch.currency} ${pitch.hourlyRate * 2}
- 3 hours: ${pitch.currency} ${pitch.hourlyRate * 3}

We accept all major payment methods through our secure payment system. Would you like to make a booking?`,
            metadata: { intent: 'pricing_query', pitchId },
          };
        }
      }

      return {
        message: `I can provide pricing information for our pitches! Each pitch has its own hourly rate. To see specific pricing, please select a pitch and I'll provide detailed cost information including any special offers or packages available.`,
        metadata: { intent: 'pricing_query' },
      };
    }

    // Check for amenities/facilities queries
    if (
      lowerMessage.includes('facilities') ||
      lowerMessage.includes('amenities') ||
      lowerMessage.includes('features')
    ) {
      if (pitchId) {
        const pitch = await this.pitchesRepository.findOne({
          where: { id: pitchId },
        });

        if (pitch) {
          const amenities = pitch.amenities || [];
          const amenitiesList = amenities.length > 0 
            ? amenities.map(a => `✓ ${a}`).join('\n')
            : 'Standard facilities';

          return {
            message: `${pitch.name} - Facilities & Features:

${amenitiesList}

Surface Type: ${pitch.surfaceType}
${pitch.indoor ? '🏠 Indoor facility' : '🌤️ Outdoor facility'}
${pitch.lighting ? '💡 Floodlit for evening games' : ''}

Additional Information:
- Capacity: ${pitch.capacity} players
- Location: ${pitch.city}, ${pitch.country}

Would you like to know anything else about this pitch?`,
            metadata: { intent: 'facilities_query', pitchId },
          };
        }
      }

      return {
        message: `Our pitches come with various amenities including changing rooms, parking, showers, and more. Please select a specific pitch to see its complete list of facilities and features.`,
        metadata: { intent: 'facilities_query' },
      };
    }

    // Check for booking policy queries
    if (
      lowerMessage.includes('cancel') ||
      lowerMessage.includes('policy') ||
      lowerMessage.includes('refund')
    ) {
      if (pitchId) {
        const pitch = await this.pitchesRepository.findOne({
          where: { id: pitchId },
        });

        if (pitch) {
          return {
            message: `Booking & Cancellation Policy for ${pitch.name}:

📋 Booking Process:
1. Select your desired date and time
2. Complete secure payment
3. Receive instant confirmation

❌ Cancellation Policy:
- Free cancellation up to ${pitch.minCancellationHours} hours before your booking
- Cancellations within ${pitch.minCancellationHours} hours are non-refundable
- Full refund processed within 5-7 business days

💳 Payment:
- Secure payment via Stripe
- All major cards accepted
- Instant booking confirmation

Need help with a booking or cancellation?`,
            metadata: { intent: 'policy_query', pitchId },
          };
        }
      }

      return {
        message: `Our booking policy ensures fair treatment for both customers and pitch owners:

- Free cancellation with adequate notice (varies by pitch)
- Secure payment processing
- Instant booking confirmations
- Full refunds for eligible cancellations

Would you like to know about a specific pitch's cancellation policy?`,
        metadata: { intent: 'policy_query' },
      };
    }

    // General greeting or help
    if (
      lowerMessage.includes('hello') ||
      lowerMessage.includes('hi') ||
      lowerMessage.includes('help')
    ) {
      return {
        message: `Hello! 👋 I'm your 24/7 soccer pitch assistant. I'm here to help you with:

📅 **Check Availability** - Real-time booking slots
💰 **Pricing Information** - Transparent pricing and rates
🏟️ **Facility Details** - Amenities and features
📋 **Booking Assistance** - Help with reservations
❓ **Answer Questions** - General inquiries

What would you like to know? Feel free to ask about availability, pricing, facilities, or anything else!`,
        metadata: { intent: 'greeting' },
      };
    }

    // Default response for unclear queries
    return {
      message: `I'm here to assist you with pitch bookings! I can help you with:

- 🕐 Checking availability for specific dates
- 💵 Pricing and payment information
- 🏟️ Facility details and amenities
- 📝 Booking policies and cancellations
- ⚽ Match organization assistance

Please let me know what you'd like to know, or select a pitch to get started!`,
      metadata: { intent: 'general' },
    };
  }

  async resolveConversation(userId: string, conversationId: string): Promise<AssistantConversation> {
    const conversation = await this.conversationsRepository.findOne({
      where: { id: conversationId, userId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    await this.conversationsRepository.update(conversationId, {
      status: ConversationStatus.RESOLVED,
      resolvedAt: new Date(),
    });

    return this.conversationsRepository.findOne({
      where: { id: conversationId },
      relations: ['pitch'],
    }) as Promise<AssistantConversation>;
  }
}
