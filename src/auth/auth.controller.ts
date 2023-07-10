import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UsePipes,
	HttpCode,
	ValidationPipe,
	Res
} from '@nestjs/common'
import { AuthService } from './auth.service';
import { AuthDto } from './auth-dto'
import { Response as ExpressResponse } from 'express';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import { UserEntity } from '../user/entities/user.entity'


@ApiTags('auth')
@Controller('auth')
export class AuthController {
		constructor(private readonly authService: AuthService) {}


	@ApiResponse({
		status: 200,
		description: 'logout',
	})
	@Post('/logout')
	logout(@Res({ passthrough: true }) response: ExpressResponse) {
		response.clearCookie('accessToken');
		return true;
	}

	@ApiResponse({
		status: 200,
		description: 'login',
		type: UserEntity
	})
	@ApiBody({ type: AuthDto })
	@Post('login')
	async login(@Body() dto: AuthDto){
			return this.authService.login(dto)
	}

	@ApiResponse({
		status: 200,
		description: 'register',
		type: UserEntity
	})
	@ApiBody({ type: AuthDto })
	@Post('register')
	async register(@Body() dto: AuthDto){
		return this.authService.register(dto)
	}
}
