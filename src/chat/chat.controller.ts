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
import { DeleteUserInGroup } from './dto/deleteUserFronGroup.dto'
import { CheckUserInGroup } from '../auth/decorators/checkUserInGroup'


@UseInterceptors(RemoveGroupsInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}


  @UseGuards(CheckUserInGroup)
  @Get(':id')
  async findGroupById(@Param('id') groupId: string){
    return this.chatService.findGroupById(groupId);
  }
  @Post('createGroup')
  createGroup(@CurrentUser("id") id: number, @Body() dto: CreateGroupDto){
    return this.chatService.createGroup(dto, id);
  }

  @UseGuards(CheckUserInGroup)
  @Post('sendMessage')
  sendGroupMessage(@CurrentUser("id") id: number, @Body() dto: SendMessageDto){
    return this.chatService.sendMessage(dto, id);
  }

  @UseGuards(CheckUserInGroup)
  @Post('addUser')
  addUser(@CurrentUser("id") id: number, @Body() dto: AddUserToGroupDto){
    return this.chatService.addUserToGroup(dto, id);
  }

  @UseGuards(CheckUserInGroup)
  @Delete(':groupId')
  async deleteGroup(@Param('groupId') groupId: string) {
    return this.chatService.deleteGroup(groupId);
  }

  @UseGuards(CheckUserInGroup)
  @Delete('/userInGroup/user')
  async dleteUserInGroup(@Body() dto: DeleteUserInGroup){
    return this.chatService.deleteUserInGroup(dto);
  }

}
