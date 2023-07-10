import { ApiProperty } from '@nestjs/swagger'

export class AddUserToGroupDto {

	@ApiProperty()
	readonly groupId: string
	@ApiProperty()
	readonly userId: number

}