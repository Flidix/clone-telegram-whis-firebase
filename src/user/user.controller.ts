import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { UserService } from './user.service';
import { CurrentUser } from '../auth/decorators/currentUser'
import { JwtAuthGuard } from '../auth/decorators/auth.decorator'

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  getUser(@Param('id') id: number){
    return this.userService.findUserById(id)
  }

  @Get('/profile/my')
  sendGroupMessage(@CurrentUser("id") id: number,){
    return this.userService.myProfile(id);
  }
}
