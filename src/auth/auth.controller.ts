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



@Controller('auth')
export class AuthController {
		constructor(private readonly authService: AuthService) {}

	@Post('/logout')
	logout(@Res({ passthrough: true }) response: ExpressResponse) {
		response.clearCookie('accessToken');
		return true;
	}
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() dto: AuthDto){
			return this.authService.login(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('register')
	async register(@Body() dto: AuthDto){
		return this.authService.register(dto)
	}
}
