import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ClientWithAddresses, UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Usuários')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('admin-dashboard')
  @UseGuards(JwtAuthGuard, AdminGuard)
  getAdminStats() {
    return { message: 'Dados sensíveis da barbearia' };
  }

  @Get('clients')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Listar clientes e seus endereços (somente ADMIN)',
  })
  async findClients(): Promise<ClientWithAddresses[]> {
    return this.usersService.findClientsWithAddresses();
  }
}
