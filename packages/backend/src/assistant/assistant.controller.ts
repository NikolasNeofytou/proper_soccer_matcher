import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AssistantService } from './assistant.service';
import { SendMessageDto, CheckAvailabilityDto } from './dto/assistant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('assistant')
@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Post('message')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send message to AI assistant' })
  @ApiResponse({ status: 200, description: 'Message sent and response received' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  sendMessage(@Request() req: any, @Body() sendMessageDto: SendMessageDto) {
    return this.assistantService.sendMessage(req.user.userId, sendMessageDto);
  }

  @Get('conversations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user conversations' })
  @ApiResponse({ status: 200, description: 'List of conversations' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getUserConversations(@Request() req: any) {
    return this.assistantService.getUserConversations(req.user.userId);
  }

  @Get('conversations/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get conversation details' })
  @ApiResponse({ status: 200, description: 'Conversation details with messages' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  getConversation(@Param('id') id: string, @Request() req: any) {
    return this.assistantService.getConversation(req.user.userId, id);
  }

  @Post('conversations/:id/resolve')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark conversation as resolved' })
  @ApiResponse({ status: 200, description: 'Conversation resolved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  resolveConversation(@Param('id') id: string, @Request() req: any) {
    return this.assistantService.resolveConversation(req.user.userId, id);
  }

  @Post('check-availability')
  @ApiOperation({ summary: 'Check pitch availability for specific date/time' })
  @ApiResponse({ status: 200, description: 'Availability information' })
  @ApiResponse({ status: 404, description: 'Pitch not found' })
  checkAvailability(@Body() checkDto: CheckAvailabilityDto) {
    return this.assistantService.checkAvailability(checkDto);
  }
}
