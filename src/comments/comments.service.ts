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

    if (!targetDiary) {
      return new NotFoundException(commentExceptionMessage.DOES_NOT_DIARY);
    }

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

  async getCommentList(diaryId: string, take?: number, skip?: number) {
    const commentsPageTake = take ?? 5;
    const commentsPageSkip = skip ?? 0;

    const [commentsByDiary, totalCount] = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.commenter', 'commenter')
      .leftJoin('comment.diary', 'diary')
      .where('diary.id = :id', { id: diaryId })
      .orderBy('comment.createdAt', 'DESC')
      .take(commentsPageTake)
      .skip(commentsPageSkip)
      .getManyAndCount();

    return {
      comments: commentsByDiary,
      totalCount,
      totalPage: Math.ceil(totalCount / commentsPageTake),
    };
  }
}
