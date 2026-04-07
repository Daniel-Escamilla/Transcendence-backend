import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}
	@Post('register')
	async register(@Body() body: {username: string; email: string; password: string }) {
		return this.authService.registerUser(body.username, body.password, body.email);
	}
	@Post('login')
	async login(@Body() body: {email: string, password: string}) {
		const result = await this.authService.login(body.email, body.password);
		if (!result) throw new UnauthorizedException('Invalid credentials');
		return result;
	}

}
