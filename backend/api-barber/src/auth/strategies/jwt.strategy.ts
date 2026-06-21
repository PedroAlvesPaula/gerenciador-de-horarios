import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role, User } from '@prisma/client';
import { UsersService } from '../../users/users.service';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}

export interface ValidatedUser {
  id: string;
  email: string;
  role: Role;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    const secret: string =
      process.env.JWT_SECRET || 'chave-secreta-desenvolvimento';

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload): Promise<ValidatedUser> {
    const user: User | null = await this.usersService.findByEmail(
      payload.email,
    );

    if (!user) {
      throw new UnauthorizedException(
        'Token inválido ou usuário não existe mais.',
      );
    }

    const validatedUser: ValidatedUser = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    return validatedUser;
  }
}
