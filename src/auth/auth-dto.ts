import { IsEmail, MinLength, IsString, IsPhoneNumber } from 'class-validator'

export class AuthDto {
	@IsString()
	username:string
	@MinLength(6, {message: 'неменше 6 символів' })
	@IsString()
	password:string

	// @IsPhoneNumber()
	telephoneNumber: number
}