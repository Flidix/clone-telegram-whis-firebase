import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from '../user/entities/user.entity'
import { Repository } from 'typeorm'
import { JwtStrategy } from './jwt.strategy'
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './auth-dto'
import {compare, hash, genSalt} from 'bcryptjs'
import bcrypt from 'bcryptjs';



@Injectable()
export class AuthService {
	constructor(@InjectRepository(UserEntity) private readonly userRepository :Repository<UserEntity>,
							private readonly jwtService: JwtService) {}




	async login (dto: AuthDto){

		const user = await this.validateUser(dto)

		return{
			user: {id:user.id, username: user.username, telephoneNumber: user.telephoneNumber},
			accessToken: await this.issueAccessToken(user.id)
		}
	}


	async register (dto: AuthDto){
		const oldUser = await this.userRepository.findOneBy({ username: dto.username })
		if (oldUser) throw new BadRequestException('email зайнятий')

		const salt = await genSalt(10);

		const newUser = await this.userRepository.create({
			username:dto.username,
			telephoneNumber: dto.telephoneNumber,
			password: await hash(dto.password, salt)
		})
		const user = await this.userRepository.save(newUser)

		return{
			user: {id:user.id, username:user.username},
			accessToken: await this.issueAccessToken(user.id)
		}
	}





	async validateUser(dto: AuthDto) {
		const user = await this.userRepository.findOne({
			where: { username: dto.username },
			select: ['id', 'username', 'password'], // Додайте поле "password" для перевірки пароля
		});
		if (!user) throw new NotFoundException('not found');

		const isValidPassword = await compare(dto.password, user.password);
		if (!isValidPassword) throw new UnauthorizedException('неправильний пароль');

		return user;
	}


	async issueAccessToken(userId:number){
		const data = {
			id:userId,
		}
		return await this.jwtService.signAsync(data, {
			expiresIn: '31d'
		})
	}

	async returnUserFields(user: UserEntity) {
		return {
			id: user.id,
			email: user.username,
		};
	}


}
