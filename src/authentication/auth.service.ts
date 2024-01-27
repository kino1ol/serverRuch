import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import * as process from 'node:process';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {
  }

  async login(loginDto: LoginDto): Promise<Tokens> {
    const { domain, password } = loginDto;

    const user = await this.prismaService.users.findUnique({
      where: { domain: domain },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const validatePassword = await bcrypt.compare(password, user.password);

    if (!validatePassword) {
      throw new NotFoundException('Пароли не совпадают');
    }

    const tokens = await this.getTokens(user.id);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async refreshTokens({ userId, refreshToken }: { userId: number, refreshToken: string }): Promise<Tokens> {
    const user = await this.prismaService.users.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user || !user.hashedRt) throw new ForbiddenException('Доступ запрещен');

    const rtMatches = await bcrypt.compare(refreshToken, user.hashedRt );
    if (!rtMatches) throw new ForbiddenException('Доступ запрещен!');

    const tokens = await this.getTokens(user.id);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async getTokens(userId: number): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync({ userId }),
      this.jwtService.signAsync({ userId }, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateRtHash(userId: number, rt: string): Promise<void> {
    const hash = await bcrypt.hash(rt, 10);
    await this.prismaService.users.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }

  async logout(userId: number): Promise<boolean> {
    await this.prismaService.users.update({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
    return true;
  }
}