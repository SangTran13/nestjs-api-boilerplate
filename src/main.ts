import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// root file -> entry point of ur nest js application

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // use validation pipe to validate incoming requests
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // to strip out any properties that are not in the dto
      forbidNonWhitelisted: true, // to throw an error if there are extra properties
      transform: true, // to transform the payloads to be objects of the dto classes
      disableErrorMessages: false, // to show error messages in the response
    }),
  ); // to use pipes globally

  // start listening for requests
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
