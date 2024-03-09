import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from 'src/comments/comments.entity';
import { DiaryEntity } from 'src/diaries/diaries.entity';
import { UserDTO } from 'src/users/dto/user.dto';
import { convertDateToString, generateYearDateList } from 'src/utility/date';
import { Repository } from 'typeorm';

@Injectable()
export class HeatmapService {
  constructor(
    @InjectRepository(DiaryEntity)
    private readonly diariesRepository: Repository<DiaryEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentsRepository: Repository<CommentEntity>,
  ) {}

  async getHeatmapGraphData(username: string, year: `${number}`) {
    const diaryCountGroupByDate = await this.diariesRepository
      .createQueryBuilder('diary')
      .leftJoin('diary.author', 'author')
      .select("DATE_TRUNC('day', diary.createdAt) as date")
      .addSelect('COUNT(*)', 'diaryCount')
      .where('author.username = :username', { username })
      .andWhere(`EXTRACT(YEAR FROM diary.createdAt) = :yearToQuery`, {
        yearToQuery: year,
      })
      .groupBy("DATE_TRUNC('day', diary.createdAt)")
      .getRawMany();

    const commentCountGroupByDate = await this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoin('comment.commenter', 'commenter')
      .select("DATE_TRUNC('day', comment.createdAt) as date")
      .addSelect('COUNT(*)', 'commentCount')
      .where('commenter.username = :username', { username })
      .andWhere(`EXTRACT(YEAR FROM comment.createdAt) = :yearToQuery`, {
        yearToQuery: year,
      })
      .groupBy("DATE_TRUNC('day', comment.createdAt)")
      .getRawMany();

    const yearDateList = generateYearDateList(year);

    const responseData = yearDateList.map((dateString) => {
      const diaryCountInfo = diaryCountGroupByDate.find(
        (el) => convertDateToString(el.date) === dateString,
      );
      const commentCountInfo = commentCountGroupByDate.find(
        (el) => convertDateToString(el.date) === dateString,
      );

      const diaryCount = diaryCountInfo ? +diaryCountInfo.diaryCount : 0;
      const commentCount = commentCountInfo
        ? +commentCountInfo.commentCount
        : 0;

      return {
        date: new Date(dateString),
        activityCount: diaryCount + commentCount,
      };
    });

    return responseData;
  }

  async getUserActivityHistory(
    accessedUser: UserDTO,
    username: string,
    date: Date,
  ) {
    const [diaries, diaryCount] = await this.diariesRepository
      .createQueryBuilder('diary')
      .leftJoin('diary.author', 'author')
      .where('author.username = :username', { username })
      .andWhere("to_char(diary.createdAt, 'YYYY-MM-DD') = :date", {
        date: convertDateToString(date),
      })
      .getManyAndCount();

    const commentCount = await this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoin('comment.commenter', 'commenter')
      .where('commenter.username = :username', { username })
      .andWhere("to_char(comment.createdAt, 'YYYY-MM-DD') = :date", {
        date: convertDateToString(date),
      })
      .getCount();

    return {
      date,
      activityCount: diaryCount + commentCount,
      activities: {
        diaries: diaries.filter(
          (diary) =>
            diary.isPublic === true || username === accessedUser.username,
        ),
        diaryCount,
        commentCount,
        randomMatchingCount: 0,
      },
    };
  }
}
