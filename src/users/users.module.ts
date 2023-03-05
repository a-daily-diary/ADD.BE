import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './users.controller';
import { UserEntity } from './users.entity';
import { UsersService } from './users.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { FavoriteEntity } from 'src/favorities/favorites.entity';
import { BookmarkEntity } from 'src/bookmarks/bookmarks.entity';
import { AwsService } from 'src/aws.service';
import { BookmarkEntity } from 'src/bookmarks/bookmarks.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, FavoriteEntity, BookmarkEntity]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      secretOrPrivateKey: process.env.SECRET_KEY,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy, AwsService],
})
export class UsersModule {}
