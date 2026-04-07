import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) { }
	async findByEmail(email: string) {
		return this.prisma.user.findUnique({ where: { email } });
	}
	async createUser(username: string, email: string, password: string, twoFactorSecret?: string, fortytwoId?: string) {
		const user = await this.prisma.user.create({ data: { username, email, password, twoFactorSecret, fortytwoId } });
		const { password: _, ...result } = user;
		return result;
	}
	async findById(id: number) {
		const user = await this.prisma.user.findUnique({ where: { id } });
		if (!user) return null;
		const { password: _, ...result } = user;
		return result;
	}
}
