import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/jwt.guard'

@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService) {}
	@UseGuards(JwtAuthGuard)
	@Get('me')
	async GetMe(@Req() req: any){
		return this.usersService.findById(req.user.id);
	}
}


