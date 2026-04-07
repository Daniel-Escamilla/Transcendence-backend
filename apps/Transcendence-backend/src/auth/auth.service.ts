import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
	) {}

	async validateUser(email: string, password: string) {
		const user = await this.usersService.findByEmail(email);
		if (!user) return null;
		const isValid = await bcrypt.compare(password, user.password)
		if (!isValid) return null;
		return user;
	}
	
	async registerUser(username: string, password: string, email: string) {
		const saltRounds = 10;
		const encriptedPass = await bcrypt.hash(password, saltRounds);
		return this.usersService.createUser(username, email, encriptedPass);
	}

	async login(email: string, password: string) {
		const user = await this.validateUser(email, password);
		if (!user) return null;
		const payload = {sub: user.id, email: user.email};
		return {accesstoken: this.jwtService.sign(payload)}
	}
}
