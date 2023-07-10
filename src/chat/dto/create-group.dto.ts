import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateGroupDto{

	@IsString()
	@ApiProperty()

	name: string

}