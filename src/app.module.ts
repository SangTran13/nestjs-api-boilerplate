import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './posts/entities/post.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';

// root module -> use all other modules
@Module({
  imports: [
    ConfigModule.forRoot(
      { isGlobal: true }
    ),
    ThrottlerModule.forRoot([{
      ttl: 60 * 1000, // 1 minute
      limit: 5,
    }]),
    CacheModule.register({
      isGlobal: true,
      ttl: 30 * 1000, // cache items for 30 seconds
      max: 100, // maximum number of items in cache
    }),
    // configure TypeOrmModule to connect to the database
    TypeOrmModule.forRoot({
      type: (process.env.DB_TYPE as any),
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Post, User],
      autoLoadEntities: true,
      synchronize: true,
    }),
    PostsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }