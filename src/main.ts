import { ValidationPipe,ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

 app.useStaticAssets(join(process.cwd(), 'src/upload'), {
  prefix: '/src/upload/',
});

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true, 
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });


  const config = new DocumentBuilder()
  .setTitle('API para la aplicación de trueque')
  .setDescription('Esta es una API diseñada por el grupo 1 de la materia programacion III, la cual es utilizada y consumida por nuestra aplicacion frontend')
  .setVersion('1.0')
  .addTag('trueque')
  .build();
const documentFactory = () => SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, documentFactory);



  
  await app.listen(process.env.PORT ?? 4000);
  console.log(process.env.PORT);
}
bootstrap();
