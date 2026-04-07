import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from './jwt.guard';

@Controller('users')
export class UserController {
	constructor(private userService: UserService) {}

	@UseGuards(JwtAuthGuard)
	@Get('me')
	async getMe(@Req() req: any) {
		return this.userService.findById(req.user.id);
	}

}
