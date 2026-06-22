import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthResponse, AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleUser } from './strategies/google.strategy';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

export interface RequestWithGoogleUser extends Request {
  user?: GoogleUser;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(): Promise<void> {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req: RequestWithGoogleUser,
  ): Promise<AuthResponse> {
    if (!req.user) {
      throw new UnauthorizedException(
        'Falha na autenticação do Google: Usuário não recebido',
      );
    }
    return this.authService.googleLogin(req.user);
  }
}
