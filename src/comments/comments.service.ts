import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { commentExceptionMessage } from 'src/constants/exceptionMessage';
import { DiaryEntity } from 'src/diaries/diaries.entity';
import { UserDTO } from 'src/users/dto/user.dto';
import { Repository } from 'typeorm';
import { CommentEntity } from './comments.entity';
import { CommentFormDTO } from './dto/comment-form.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(DiaryEntity)
    private readonly diaryRepository: Repository<DiaryEntity>,
  ) {}

  async createComment(
    diaryId: string,
    accessedUser: UserDTO,
    commentFormDTO: CommentFormDTO,
  ) {
    const targetDiary = await this.diaryRepository.findOneBy({ id: diaryId });

    const targetDiary1 = await this.diaryRepository
      .createQueryBuilder('diary')
      .leftJoinAndSelect('diary.comments', 'comments')
      .where({ id: diaryId })
      .getOne();

    if (!targetDiary) {
      return new NotFoundException(commentExceptionMessage.DOES_NOT_DIARY);
    }

    console.log(targetDiary1);

    targetDiary.commentCount += 1;
    const newComment = await this.commentRepository.create({
      commenter: accessedUser,
      diary: targetDiary,
      comment: commentFormDTO.comment,
    });

    await this.diaryRepository.save(targetDiary);
    await this.commentRepository.save(newComment);

    return newComment;
  }
}
