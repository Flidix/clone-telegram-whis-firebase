import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '../user/entities/user.entity'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { getJwtConfig } from '../config/jwtr.config'
import { JwtModule } from '@nestjs/jwt'
import { config } from 'rxjs'

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
    TypeOrmModule.forFeature([UserEntity]),

  ],
  controllers: [ChatController],
  providers: [ChatService]
})
export class ChatModule{
}
