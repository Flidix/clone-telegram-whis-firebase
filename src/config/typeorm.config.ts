import {TypeOrmModuleOptions} from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";

export const getTypeOrmConfig = async (configService: ConfigService): Promise<TypeOrmModuleOptions> => ({
    type: "postgres",
    host: 'localhost',
    port: configService.get('PORT'),
    username: 'postgres',
    password: configService.get('PASSWORD'),
    database: configService.get('DATA_BASE'),
    autoLoadEntities: true,
    synchronize: true
})