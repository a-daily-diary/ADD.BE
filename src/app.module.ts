import { Module } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { UserEntity } from './users/users.entity';
import { DiariesModule } from './diaries/diaries.module';
import { DiaryEntity } from './diaries/diaries.entity';
import { FavoritesModule } from './favorities/favorites.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { AwsService } from './aws.service';
import { CommentsModule } from './comments/comments.module';
import { BadgesModule } from './badges/badges.module';

const typeOrmModuleOptions = {
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    return {
      namingStrategy: new SnakeNamingStrategy(),
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [UserEntity, DiaryEntity],
      synchronize: true, // set 'false' in production
      autoLoadEntities: true,
      logging: true, // production에서는 false로
      keepConnectionAlive: true,
    };
  },
};

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    UsersModule,
    DiariesModule,
    FavoritesModule,
    BookmarksModule,
    CommentsModule,
    BadgesModule,
  ],
  controllers: [AppController],
  providers: [AppService, AwsService],
  exports: [AwsService],
})
export class AppModule {}
