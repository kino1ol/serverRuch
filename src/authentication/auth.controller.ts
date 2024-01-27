import { AuthService } from './auth.service';
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { Public } from '../decorator/publc.decorator';
import { LoginDto } from './auth.dto';
import { Tokens } from './types';
import { AuthGuard } from '@nestjs/passport';

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GetCurrentUser } from './auth.decorators';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return user.userId;
  },
);

@Controller('auth')
export  class  AuthController {

  constructor(private authService: AuthService) { }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto): Promise<any> {
      return this.authService.login(loginDto)
  }

  @Public()
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens({
      userId, refreshToken
    });
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: number): Promise<boolean> {
    return this.authService.logout(userId);
  }
}