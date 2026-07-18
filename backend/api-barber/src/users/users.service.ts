import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

export interface CreateGoogleUserInput {
  email: string;
  name: string;
  googleId: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private withoutPassword(user: User): Omit<User, 'password'> {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      googleId: user.googleId,
      phone: user.phone,
      role: user.role,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { googleId } });
  }

  async linkGoogleAccount(userId: string, googleId: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { googleId },
    });
  }

  async create(
    data: Prisma.UserCreateInput,
    isGoogleClient?: boolean,
  ): Promise<Omit<User, 'password'>> {
    if (isGoogleClient) {
      const user = await this.prisma.user.create({
        data: {
          ...data,
        },
      });
      return this.withoutPassword(user);
    }
    const hashedPassword = await bcrypt.hash(data.password ?? '', 10);

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    return this.withoutPassword(user);
  }

  async createGoogleUser(data: CreateGoogleUserInput): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        googleId: data.googleId,
      },
    });

    return user;
  }
}
