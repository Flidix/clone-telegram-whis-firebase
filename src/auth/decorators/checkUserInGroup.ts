import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { initializeApp } from 'firebase/app'
import { FirebaseConfig } from '../../config/firebase.config'
import { get, getDatabase, ref } from 'firebase/database'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from '../../user/entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class CheckUserInGroup implements CanActivate {

	constructor(
		@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
		private jwtService: JwtService
	) {
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {

		const req = context.switchToHttp().getRequest();
		try {
			const authHeader = req.headers.authorization;
			const [bearer, token] = authHeader.split(' ');

			const { id } = this.jwtService.verify(token);
			const user = await this.userRepository.findOne({ where: { id } });
			const groupId = req.body.groupId || req.body.chatId || req.params.id;

			const check = user.groups.find((group) => group.id === groupId)

			if (check) {
				return true;
			}

		} catch (e) {
			throw new NotFoundException("not found");
		}
	}
}
