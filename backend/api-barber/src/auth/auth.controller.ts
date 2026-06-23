import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthResponse, AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleUser } from './strategies/google.strategy';
import { AuthGuard } from '@nestjs/passport';

export interface RequestWithGoogleUser extends Request {
  user?: GoogleUser;
}

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Cadastrar um novo usuário no sistema' })
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Fazer login com e-mail e senha' })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Redirecionar para o login com o Google' })
  async googleAuth(): Promise<void> {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Rota de retorno do Google (Uso interno)' })
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
