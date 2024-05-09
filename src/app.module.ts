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
import { FavoritesModule } from './favorites/favorites.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { AwsService } from './aws.service';
import { CommentsModule } from './comments/comments.module';
import { BadgesModule } from './badges/badges.module';
import { TermsAgreementsModule } from './terms-agreements/terms-agreements.module';
import { UserToTermsAgreementsModule } from './user-to-terms-agreements/user-to-terms-agreements.module';
import { UserToBadgesModule } from './user-to-badges/user-to-badges.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './email.service';
import { MatchingRulesModule } from './matching-rules/matching-rules.module';
import { ActivitiesModule } from './activities/activities.module';
import { MatchingModule } from './matching/matching.module';

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
    TermsAgreementsModule,
    UserToTermsAgreementsModule,
    UserToBadgesModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      },
    }),
    MatchingRulesModule,
    ActivitiesModule,
    MatchingModule,
  ],
  controllers: [AppController],
  providers: [AppService, AwsService, MailService],
  exports: [AwsService, MailService],
})
export class AppModule {}
