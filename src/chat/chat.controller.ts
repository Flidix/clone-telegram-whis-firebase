import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, UseInterceptors } from '@nestjs/common'
import { ChatService } from './chat.service';
import { CreateGroupDto } from './dto/create-group.dto'
import { UserEntity } from '../user/entities/user.entity'
import { AuthGuard } from '@nestjs/passport'
import { JwtAuthGuard } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/currentUser'
import { SendMessageDto } from './dto/sendMEssage.dto'
import { RemoveGroupsInterceptor } from '../auth/decorators/groupsGuard'
import { AddUserToGroupDto } from './dto/addUserToGroup.dto'


@UseInterceptors(RemoveGroupsInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}


  @Get(':id')
  async findGroupById(@Param('id') groupId: string){
    return this.chatService.findGroupById(groupId);
  }
  @Post('createGroup')
  createGroup(@CurrentUser("id") id: number, @Body() dto: CreateGroupDto){
    return this.chatService.createGroup(dto, id);
  }

  @Post('sendMessage')
  sendGroupMessage(@CurrentUser("id") id: number, @Body() dto: SendMessageDto){
    return this.chatService.sendMessage(dto, id);
  }

  @Post('addUser')
  addUser(@Body() dto: AddUserToGroupDto){
    return this.chatService.addUserToGroup(dto);
  }

}
