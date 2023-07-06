import { Body, Get, Injectable, Post } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from './entities/user.entity'
import { Repository } from 'typeorm'
import { CurrentUser } from '../auth/decorators/currentUser'
import { SendMessageDto } from '../chat/dto/sendMEssage.dto'

@Injectable()
export class UserService {

	constructor(
		@InjectRepository(UserEntity) private readonly userRepository :Repository<UserEntity>,

	) {}

	async findUserById(id: number) {
		return await this.userRepository.findOne({
				where: {
					id: id
				}
			});
	}

	async myProfile(id: number) {
		return await this.userRepository.findOne({
			where: { id: id },
			select: {
				id: true,
				createdAt: true,
				updated: true,
				username: true,
				telephoneNumber: true,
				groups: true
			}
		});
	}

}
