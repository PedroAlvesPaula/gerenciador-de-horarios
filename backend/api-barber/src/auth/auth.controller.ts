import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthResponse, AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleLoginDto } from './dto/googleLogin.dto';

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

  @Post('google')
  @ApiOperation({ summary: 'Validar token do Google enviado pelo frontend' })
  async googleLogin(@Body() body: GoogleLoginDto): Promise<AuthResponse> {
    return this.authService.verifyGoogleToken(body.token);
  }
}
