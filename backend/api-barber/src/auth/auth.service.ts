import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { OAuth2Client, type TokenPayload } from 'google-auth-library';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

@Injectable()
export class AuthService {
  private readonly googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
  );

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const userExists = await this.usersService.findByEmail(data.email);
    if (userExists) {
      throw new ConflictException('Este e-mail já está em uso.');
    }
    return this.usersService.create(data);
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.password ?? '',
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha inválida.');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async verifyGoogleToken(googleToken: string): Promise<AuthResponse> {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      throw new UnauthorizedException('Google login is not configured.');
    }

    let payload: TokenPayload | undefined;
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: googleToken,
        audience: googleClientId,
      });
      payload = ticket.getPayload();
    } catch {
      throw new UnauthorizedException('Invalid or expired Google ID token.');
    }

    if (!payload?.sub || !payload.email || !payload.email_verified) {
      throw new UnauthorizedException('Google account email is not verified.');
    }

    let user = await this.usersService.findByGoogleId(payload.sub);

    if (!user) {
      const userWithSameEmail = await this.usersService.findByEmail(
        payload.email,
      );

      if (userWithSameEmail?.googleId) {
        throw new UnauthorizedException(
          'This email is already linked to another Google account.',
        );
      }

      user = userWithSameEmail
        ? await this.usersService.linkGoogleAccount(
            userWithSameEmail.id,
            payload.sub,
          )
        : await this.usersService.createGoogleUser({
            email: payload.email,
            name: payload.name || 'Google User',
            googleId: payload.sub,
          });
    }

    const payloadJwt = { sub: user.id, email: user.email, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payloadJwt),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
