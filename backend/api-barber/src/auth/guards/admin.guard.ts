import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Role } from '@prisma/client';

export interface JwtUser {
  id: string;
  email: string;
  role: Role;
}

export interface RequestWithUser {
  user?: JwtUser;
}

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: RequestWithUser = context
      .switchToHttp()
      .getRequest<RequestWithUser>();

    const user: JwtUser | undefined = request.user;

    if (!user || user.role !== 'ADMIN') {
      throw new ForbiddenException('Acesso restrito para administradores.');
    }
    return true;
  }
}
