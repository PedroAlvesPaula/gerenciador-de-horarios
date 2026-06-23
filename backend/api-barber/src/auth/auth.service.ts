import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { LoginTicket, OAuth2Client, TokenPayload } from 'google-auth-library';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';

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
    let ticket: LoginTicket;

    try {
      ticket = await this.googleClient.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (error) {
      throw new UnauthorizedException(
        error,
        'Invalid or expired Google token.',
      );
    }

    const payload: TokenPayload | undefined = ticket.getPayload();

    if (!payload || !payload.email) {
      throw new UnauthorizedException(
        'Google token does not contain an email.',
      );
    }

    const email: string = payload.email;
    const name: string = payload.name || 'Google User';

    let user: Omit<User, 'password'> | null =
      await this.usersService.findByEmail(email);

    if (!user) {
      user = await this.usersService.create({
        email: email,
        name: name,
        password: null,
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
