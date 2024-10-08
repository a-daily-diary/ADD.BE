import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  commentExceptionMessage,
  diaryExceptionMessage,
} from 'src/constants/exceptionMessage';
import { DiaryEntity } from 'src/diaries/diaries.entity';
import { UserDTO } from 'src/users/dto/user.dto';
import { Repository } from 'typeorm';
import { CommentEntity } from './comments.entity';
import { CommentFormDTO } from './dto/comment-form.dto';
import { UserToBadgesService } from 'src/user-to-badges/user-to-badges.service';
import { BadgeAcquisitionConditionForComment } from 'src/constants/badgeAcquisitionCondition';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(DiaryEntity)
    private readonly diaryRepository: Repository<DiaryEntity>,
    private readonly userToBadgesService: UserToBadgesService,
  ) {}

  async createComment(
    diaryId: string,
    accessedUser: UserDTO,
    commentFormDTO: CommentFormDTO,
  ) {
    const targetDiary = await this.diaryRepository.findOneBy({ id: diaryId });

    if (!targetDiary) {
      throw new NotFoundException(diaryExceptionMessage.DOES_NOT_EXIST_DIARY);
    }

    targetDiary.commentCount += 1;
    const newComment = await this.commentRepository.create({
      commenter: accessedUser,
      diary: targetDiary,
      comment: commentFormDTO.comment,
    });

    await this.diaryRepository.save(targetDiary);
    await this.commentRepository.save(newComment);

    const totalCommentCount = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoin('comment.commenter', 'commenter')
      .where('commenter.id = :userId', { userId: accessedUser.id })
      .getCount();

    // 뱃지 획득 조건을 추가하고 싶은 경우 /src/constants/badgeAcquisitionCondition.ts에 추가
    const badgeToGet = await this.userToBadgesService.achievedBadge(
      accessedUser,
      totalCommentCount,
      BadgeAcquisitionConditionForComment,
    );

    return {
      comment: newComment,
      badge: badgeToGet,
    };
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

  async updateComment(
    diaryId: string,
    commentId: string,
    accessedUser: UserDTO,
    commentFormDTO: CommentFormDTO,
  ) {
    const targetDiary = await this.diaryRepository.findOneBy({ id: diaryId });

    if (!targetDiary) {
      throw new NotFoundException(diaryExceptionMessage.DOES_NOT_EXIST_DIARY);
    }

    const targetComment = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.commenter', 'commenter')
      .where('comment.id = :id', { id: commentId })
      .getOne();

    if (!targetComment) {
      throw new NotFoundException(
        commentExceptionMessage.DOES_NOT_EXIST_COMMENT,
      );
    }

    if (targetComment.commenter.id !== accessedUser.id) {
      throw new BadRequestException(commentExceptionMessage.OWNER_ONLY_EDIT);
    }

    await this.commentRepository.update(commentId, commentFormDTO);

    return await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.commenter', 'commenter')
      .where('comment.id = :id', { id: commentId })
      .getOne();
  }

  async deleteComment(
    diaryId: string,
    commentId: string,
    accessedUser: UserDTO,
  ) {
    const targetDiary = await this.diaryRepository
      .createQueryBuilder('diary')
      .leftJoinAndSelect('diary.author', 'author')
      .where('diary.id = :id', { id: diaryId })
      .getOne();

    if (!targetDiary) {
      throw new NotFoundException(diaryExceptionMessage.DOES_NOT_EXIST_DIARY);
    }

    const targetComment = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.commenter', 'commenter')
      .where('comment.id = :id', { id: commentId })
      .getOne();

    if (!targetComment) {
      throw new NotFoundException(
        commentExceptionMessage.DOES_NOT_EXIST_COMMENT,
      );
    }

    const diaryAuthorId = targetDiary.author.id;
    const commenterId = targetComment.commenter.id;

    if (![diaryAuthorId, commenterId].includes(accessedUser.id)) {
      throw new BadRequestException(commentExceptionMessage.OWNER_ONLY_DELETE);
    }

    targetDiary.commentCount -= 1;
    await this.diaryRepository.save(targetDiary);
    await this.commentRepository.softDelete(commentId);

    return { message: '삭제되었습니다.' };
  }
}
