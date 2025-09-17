import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

// root file -> entry point of ur nest js application

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule , {
    logger : ['error', 'warn', 'log', 'debug', 'verbose'], // enable all log levels
  });

  // use validation pipe to validate incoming requests
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // to strip out any properties that are not in the dto
      forbidNonWhitelisted: true, // to throw an error if there are extra properties
      transform: true, // to transform the payloads to be objects of the dto classes
      disableErrorMessages: false, // to show error messages in the response
    }),
  ); // to use pipes globally

  app.useGlobalInterceptors(new LoggingInterceptor()); // to use interceptors globally

  // start listening for requests
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
