import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterUserDto) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: LoginUserDto) {
    return this.authService.login(body);
  }
}
