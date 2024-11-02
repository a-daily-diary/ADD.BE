import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from 'src/comments/comments.entity';
import { DiaryEntity } from 'src/diaries/diaries.entity';
import { UserDTO } from 'src/users/dto/user.dto';
import { generateCustomFieldForDiary } from 'src/utility/customField';
import {
  convertDateToString,
  generateLastOneYearDateList,
  generateYearDateList,
} from 'src/utility/date';
import { MatchingHistoryEntity } from 'src/matching-histories/matching-histories.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(DiaryEntity)
    private readonly diariesRepository: Repository<DiaryEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentsRepository: Repository<CommentEntity>,
    @InjectRepository(MatchingHistoryEntity)
    private readonly matchingHistoryRepository: Repository<MatchingHistoryEntity>,
  ) {}
  async getHeatmapGraphData(username: string, year?: `${number}`) {
    const diariesCountQuery = this.diariesRepository
      .createQueryBuilder('diary')
      .leftJoin('diary.author', 'author')
      .select("DATE_TRUNC('day', diary.createdAt) as date")
      .addSelect('COUNT(*)', 'diaryCount')
      .where('author.username = :username', { username });

    const commentsCountQuery = this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoin('comment.commenter', 'commenter')
      .select("DATE_TRUNC('day', comment.createdAt) as date")
      .addSelect('COUNT(*)', 'commentCount')
      .where('commenter.username = :username', { username });

    const matchingHistoryCountQuery = this.matchingHistoryRepository
      .createQueryBuilder('matchingHistory')
      .leftJoin('matchingHistory.user1', 'user1')
      .leftJoin('matchingHistory.user2', 'user2')
      .select("DATE_TRUNC('day', matchingHistory.createdAt) as date")
      .addSelect('COUNT(*)', 'matchingHistoryCount')
      .where('user1.username = :username', { username })
      .orWhere('user2.username = :username', { username });

    if (year !== undefined) {
      diariesCountQuery.andWhere(
        `EXTRACT(YEAR FROM diary.createdAt) = :yearToQuery`,
        {
          yearToQuery: year,
        },
      );

      commentsCountQuery.andWhere(
        `EXTRACT(YEAR FROM comment.createdAt) = :yearToQuery`,
        {
          yearToQuery: year,
        },
      );

      matchingHistoryCountQuery.andWhere(
        `EXTRACT(YEAR FROM matchingHistory.createdAt) = :yearToQuery`,
        {
          yearToQuery: year,
        },
      );
    }
    const diaryCountGroupByDate = await diariesCountQuery
      .groupBy("DATE_TRUNC('day', diary.createdAt)")
      .getRawMany();

    const commentCountGroupByDate = await commentsCountQuery
      .groupBy("DATE_TRUNC('day', comment.createdAt)")
      .getRawMany();

    const matchingHistoryCountGroupByDate = await matchingHistoryCountQuery
      .groupBy("DATE_TRUNC('day', matchingHistory.createdAt)")
      .getRawMany();

    const yearDateList =
      year === undefined
        ? generateLastOneYearDateList()
        : generateYearDateList(year);

    const responseData = yearDateList.map((dateString) => {
      const diaryCountInfo = diaryCountGroupByDate.find(
        (el) => convertDateToString(el.date) === dateString,
      );
      const commentCountInfo = commentCountGroupByDate.find(
        (el) => convertDateToString(el.date) === dateString,
      );
      const matchingHistoryCountInfo = matchingHistoryCountGroupByDate.find(
        (el) => convertDateToString(el.date) === dateString,
      );

      const diaryCount = diaryCountInfo ? +diaryCountInfo.diaryCount : 0;
      const commentCount = commentCountInfo
        ? +commentCountInfo.commentCount
        : 0;

      const matchingHistoryCount = matchingHistoryCountInfo
        ? +matchingHistoryCountInfo.matchingHistoryCount
        : 0;

      return {
        date: dateString,
        activityCount: diaryCount + commentCount + matchingHistoryCount,
      };
    });

    return responseData;
  }

  async getUserActivity(accessedUser: UserDTO, username: string, date: Date) {
    const [diaries, diaryCount] = await this.diariesRepository
      .createQueryBuilder('diary')
      .leftJoinAndSelect('diary.author', 'author')
      .leftJoinAndSelect('diary.favorites', 'favorites')
      .leftJoinAndSelect('favorites.user', 'favoriteUser')
      .leftJoinAndSelect('diary.bookmarks', 'bookmarks')
      .leftJoinAndSelect('bookmarks.user', 'bookmarksUser')
      .where('author.username = :username', { username })
      .andWhere("to_char(diary.createdAt, 'YYYY-MM-DD') = :date", {
        date: convertDateToString(date),
      })
      .getManyAndCount();

    const resultDiaries = diaries.map((diary) => {
      return generateCustomFieldForDiary(diary, accessedUser.id);
    });

    const commentCount = await this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoin('comment.commenter', 'commenter')
      .where('commenter.username = :username', { username })
      .andWhere("to_char(comment.createdAt, 'YYYY-MM-DD') = :date", {
        date: convertDateToString(date),
      })
      .getCount();

    const randomMatchingCount = await this.matchingHistoryRepository
      .createQueryBuilder('matchingHistory')
      .leftJoin('matchingHistory.user1', 'user1')
      .leftJoin('matchingHistory.user2', 'user2')
      .where('user1.username = :username', { username })
      .orWhere('user2.username = :username', { username })
      .andWhere("to_char(matchingHistory.createdAt, 'YYYY-MM-DD') = :date", {
        date: convertDateToString(date),
      })
      .getCount();

    return {
      date,
      activityCount: diaryCount + commentCount + randomMatchingCount,
      activities: {
        diaries: resultDiaries.filter(
          (diary) =>
            diary.isPublic === true || username === accessedUser.username,
        ),
        diaryCount,
        commentCount,
        randomMatchingCount,
      },
    };
  }
}
