import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {getTypeOrmConfig} from "./config/typeorm.config";
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
      ConfigModule.forRoot(),
      TypeOrmModule.forRootAsync({
        imports:[ConfigModule],
        inject:[ConfigService],
        useFactory: getTypeOrmConfig
      }),
      UserModule,
      AuthModule,
      ChatModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
