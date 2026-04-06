import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) { }
	async findByEmail(email: string): Promise<User | null> {
		return this.usersRepository.findOne({ where: { email } });
	}
	async createUser(username: string, email: string, password: string, twoFactorSecret?: string, fortytwoId?: string): Promise<User> {
		const user = this.usersRepository.create({ username, email, password, twoFactorSecret, fortytwoId })
		return this.usersRepository.save(user);
	}
}


