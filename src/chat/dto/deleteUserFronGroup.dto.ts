import { ApiProperty } from '@nestjs/swagger'

export class DeleteUserInGroup {
   @ApiProperty()

   readonly chatId: string
   @ApiProperty()

   readonly userId: number
}