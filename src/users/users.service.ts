import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  uploadImg(file: Express.Multer.File) {
    const port = process.env.PORT;
    const thumbnailUrl = `http://localhost:${port}/media/users/${file.filename}`;
    return { imgUrl: thumbnailUrl };
  }
}
