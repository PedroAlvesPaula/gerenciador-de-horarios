import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleUser } from './strategies/google.strategy';

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

  async googleLogin(reqUser: GoogleUser): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(reqUser.email);

    const userToResponse = {} as AuthResponse['user'];

    if (!user) {
      const newUser = await this.usersService.createGoogleUser({
        email: reqUser.email,
        name: reqUser.name,
        googleId: reqUser.googleId,
      });

      userToResponse.id = newUser.id;
      userToResponse.email = newUser.email;
      userToResponse.name = newUser.name;
      userToResponse.role = newUser.role;
    } else {
      userToResponse.id = user.id;
      userToResponse.email = user.email;
      userToResponse.name = user.name;
      userToResponse.role = user.role;
    }

    const payload = {
      sub: userToResponse.id,
      email: userToResponse.email,
      role: userToResponse.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: { ...userToResponse },
    };
  }
}
