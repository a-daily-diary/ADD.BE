import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from 'src/comments/comments.entity';
import { DiaryEntity } from 'src/diaries/diaries.entity';
import {
  convertDateToString,
  generateLastOneYearDateList,
} from 'src/utility/date';
import { Repository } from 'typeorm';

@Injectable()
export class HeatmapService {
  constructor(
    @InjectRepository(DiaryEntity)
    private readonly diariesRepository: Repository<DiaryEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentsRepository: Repository<CommentEntity>,
  ) {}

  async getHeatmapGraphData(username: string) {
    const diaryCountGroupByDate = await this.diariesRepository
      .createQueryBuilder('diary')
      .leftJoin('diary.author', 'author')
      .select("DATE_TRUNC('day', diary.createdAt) as date")
      .addSelect('COUNT(*)', 'diaryCount')
      .where('author.username = :username', { username })
      .groupBy("DATE_TRUNC('day', diary.createdAt)")
      .getRawMany();

    const commentCountGroupByDate = await this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoin('comment.commenter', 'commenter')
      .select("DATE_TRUNC('day', comment.createdAt) as date")
      .addSelect('COUNT(*)', 'commentCount')
      .where('commenter.username = :username', { username })
      .groupBy("DATE_TRUNC('day', comment.createdAt)")
      .getRawMany();

    const lastOneYearDateList = generateLastOneYearDateList();

    const responseData = lastOneYearDateList.map((dateString) => {
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
}
