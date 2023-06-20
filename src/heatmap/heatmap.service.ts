import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from 'src/comments/comments.entity';
import { DiaryEntity } from 'src/diaries/diaries.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HeatmapService {
  constructor(
    @InjectRepository(DiaryEntity)
    private readonly diariesRepository: Repository<DiaryEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentsRepository: Repository<CommentEntity>,
  ) {}

  async heatmapTestAPI() {
    return 'test';
  }
}
