import { ApiProperty } from '@nestjs/swagger'

export class SendMessageDto {

	@ApiProperty()

	readonly chatId: string
	@ApiProperty()

	readonly message: string

}