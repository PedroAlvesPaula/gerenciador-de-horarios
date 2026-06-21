import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('admin-dashboard')
  @UseGuards(JwtAuthGuard, AdminGuard)
  getAdminStats() {
    return { message: 'Dados sensíveis da barbearia' };
  }
}
