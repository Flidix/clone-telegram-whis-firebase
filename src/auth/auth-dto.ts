import { IsEmail, MinLength, IsString, IsPhoneNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class AuthDto {
	@IsString()
	@ApiProperty()
	username:string
	@MinLength(6, {message: 'неменше 6 символів' })
	@IsString()
	@ApiProperty()

	password:string

	@IsPhoneNumber()
	@ApiProperty()

	telephoneNumber: string
}