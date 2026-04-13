import { Controller, Get, UseGuards } from '@nestjs/common';

import { User } from '../../common/decorators';
import { AuthGuard } from '../../common/guards';
import type { CurrentUser } from '../../common/interfaces';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  me(@User() user: CurrentUser) {
    return this.usersService.me(user);
  }
}
