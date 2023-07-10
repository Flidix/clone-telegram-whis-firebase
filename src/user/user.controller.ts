import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { UserService } from './user.service';
import { CurrentUser } from '../auth/decorators/currentUser'
import { JwtAuthGuard } from '../auth/decorators/auth.decorator'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { UserEntity } from './entities/user.entity'

@ApiTags('user')
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found user',
    type: UserEntity
  })
  getUser(@Param('id') id: number){
    return this.userService.findUserById(id)
  }

  @ApiResponse({
    status: 200,
    description: 'The found user',
    type: UserEntity
  })
  @Get('/profile/my')
  sendGroupMessage(@CurrentUser("id") id: number,){
    return this.userService.myProfile(id);
  }
}
