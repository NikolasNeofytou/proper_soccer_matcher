import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { SearchReviewDto } from './dto/search-review.dto';
import { OwnerResponseDto } from './dto/owner-response.dto';
import { ReviewHelpfulnessDto } from './dto/review-helpfulness.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request (already reviewed or invalid booking)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Pitch or booking not found' })
  create(@Request() req: any, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(req.user.userId, createReviewDto);
  }

  @Get()
  @ApiOperation({ summary: 'Search reviews with filters' })
  @ApiResponse({ status: 200, description: 'List of reviews' })
  findAll(@Query() searchDto: SearchReviewDto) {
    return this.reviewsService.findAll(searchDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get review details by ID' })
  @ApiResponse({ status: 200, description: 'Review details' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update review (author only)' })
  @ApiResponse({ status: 200, description: 'Review updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the author' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  update(@Param('id') id: string, @Request() req: any, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(id, req.user.userId, updateReviewDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete review (soft delete, author only)' })
  @ApiResponse({ status: 204, description: 'Review deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the author' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.reviewsService.remove(id, req.user.userId);
  }

  @Post(':id/response')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add owner response to review (pitch owners only)' })
  @ApiResponse({ status: 200, description: 'Response added successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the pitch owner' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  addOwnerResponse(
    @Param('id') id: string,
    @Request() req: any,
    @Body() ownerResponseDto: OwnerResponseDto,
  ) {
    return this.reviewsService.addOwnerResponse(id, req.user.userId, ownerResponseDto);
  }

  @Post(':id/helpful')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark review as helpful or not helpful' })
  @ApiResponse({ status: 200, description: 'Helpfulness vote recorded' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  markHelpful(
    @Param('id') id: string,
    @Request() req: any,
    @Body() helpfulnessDto: ReviewHelpfulnessDto,
  ) {
    return this.reviewsService.markHelpful(id, req.user.userId, helpfulnessDto);
  }
}
