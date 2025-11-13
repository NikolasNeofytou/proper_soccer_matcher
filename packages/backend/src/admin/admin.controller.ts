import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { UpdateUserStatusDto, UpdateUserRoleDto, VerifyPitchDto } from './dto/admin.dto';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // User Management
  @Get('users')
  @ApiOperation({ summary: 'Get all users (admin only)' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin access required' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getAllUsers(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.adminService.getAllUsers(page, limit);
  }

  @Patch('users/:id/status')
  @ApiOperation({ summary: 'Update user status (admin only)' })
  @ApiResponse({ status: 200, description: 'User status updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin access required' })
  updateUserStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateUserStatusDto) {
    return this.adminService.updateUserStatus(id, updateStatusDto.status);
  }

  @Patch('users/:id/role')
  @ApiOperation({ summary: 'Update user role (admin only)' })
  @ApiResponse({ status: 200, description: 'User role updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin access required' })
  updateUserRole(@Param('id') id: string, @Body() updateRoleDto: UpdateUserRoleDto) {
    return this.adminService.updateUserRole(id, updateRoleDto.role);
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user (admin only)' })
  @ApiResponse({ status: 204, description: 'User deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin access required' })
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  // Pitch Management
  @Get('pitches')
  @ApiOperation({ summary: 'Get all pitches (admin only)' })
  @ApiResponse({ status: 200, description: 'List of all pitches' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin access required' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getAllPitches(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.adminService.getAllPitches(page, limit);
  }

  @Post('pitches/:id/verify')
  @ApiOperation({ summary: 'Verify or unverify pitch (admin only)' })
  @ApiResponse({ status: 200, description: 'Pitch verification status updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin access required' })
  verifyPitch(@Param('id') id: string, @Body() verifyDto: VerifyPitchDto) {
    return this.adminService.verifyPitch(id, verifyDto.verified);
  }

  // Statistics
  @Get('statistics')
  @ApiOperation({ summary: 'Get platform statistics (admin only)' })
  @ApiResponse({ status: 200, description: 'Platform statistics' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin access required' })
  getPlatformStatistics() {
    return this.adminService.getPlatformStatistics();
  }

  @Get('activity')
  @ApiOperation({ summary: 'Get recent platform activity (admin only)' })
  @ApiResponse({ status: 200, description: 'Recent activity' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin access required' })
  getRecentActivity() {
    return this.adminService.getRecentActivity();
  }

  // Content Moderation
  @Get('reviews/flagged')
  @ApiOperation({ summary: 'Get flagged reviews (admin only)' })
  @ApiResponse({ status: 200, description: 'List of flagged reviews' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin access required' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getFlaggedReviews(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.adminService.getFlaggedReviews(page, limit);
  }

  @Post('reviews/:id/moderate')
  @ApiOperation({ summary: 'Moderate review (admin only)' })
  @ApiResponse({ status: 200, description: 'Review moderated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin access required' })
  moderateReview(
    @Param('id') id: string,
    @Body() moderateDto: { flagged: boolean; reason?: string },
  ) {
    return this.adminService.moderateReview(id, moderateDto.flagged, moderateDto.reason);
  }
}
