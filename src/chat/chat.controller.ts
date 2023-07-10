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
import { ApiResponse, ApiTags } from '@nestjs/swagger'


@ApiTags('chat')
@UseInterceptors(RemoveGroupsInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}


  @UseGuards(CheckUserInGroup)
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found group',
  })
  async findGroupById(@Param('id') groupId: string){
    return this.chatService.findGroupById(groupId);
  }
  @ApiResponse({
    status: 200,
    description: 'create a new group',
  })
  @Post('createGroup')
  createGroup(@CurrentUser("id") id: number, @Body() dto: CreateGroupDto){
    return this.chatService.createGroup(dto, id);
  }

  @ApiResponse({
    status: 200,
    description: 'send a message',
  })
  @UseGuards(CheckUserInGroup)
  @Post('sendMessage')
  sendGroupMessage(@CurrentUser("id") id: number, @Body() dto: SendMessageDto){
    return this.chatService.sendMessage(dto, id);
  }

  @ApiResponse({
    status: 200,
    description: 'add user to group',
  })
  @UseGuards(CheckUserInGroup)
  @Post('addUser')
  addUser(@CurrentUser("id") id: number, @Body() dto: AddUserToGroupDto){
    return this.chatService.addUserToGroup(dto, id);
  }

  @ApiResponse({
    status: 200,
    description: 'delete group',
  })
  @UseGuards(CheckUserInGroup)
  @Delete(':groupId')
  async deleteGroup(@Param('groupId') groupId: string) {
    return this.chatService.deleteGroup(groupId);
  }

  @ApiResponse({
    status: 200,
    description: 'delete user from group',
  })
  @UseGuards(CheckUserInGroup)
  @Delete('/userInGroup/user')
  async dleteUserInGroup(@Body() dto: DeleteUserInGroup){
    return this.chatService.deleteUserInGroup(dto);
  }

}
