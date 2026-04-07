import { Entity, PrimaryGeneratedColumn , Column} from 'typeorm'

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;
	@Column()
	username: string;
	@Column()
	email: string;
	@Column({ select: false })
	password: string;
	@Column({ nullable: true })
	twoFactorSecret: string;
	@Column({ nullable: true })
	fortytwoId: string;
}
