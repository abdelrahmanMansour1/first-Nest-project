import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { AuthGuardJwt } from './auth-guard.jwt';
import { AuthGuardLocal } from './auth-guard.local';

@Controller('/auth')
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @UseGuards(AuthGuardLocal)
  async login(@CurrentUser() user) {
    return {
      userId: user.id,
      token: this.authService.getUserToken(user),
    };
  }

  @Get('profile')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async getProfile(@CurrentUser() user) {
    return user;
  }
}
