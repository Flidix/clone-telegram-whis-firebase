import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  const config = new DocumentBuilder()
    .setTitle('clone telegram with firebase')
    .setDescription('chat app')
    .setVersion('1.0')
    .addTag('groups')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(8000);
  console.log('8000')
}
bootstrap();
