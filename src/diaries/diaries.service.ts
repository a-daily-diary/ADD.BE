import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDTO } from 'src/users/dto/user.dto';
import { Repository } from 'typeorm';
import { DiaryEntity } from './diaries.entity';
import { DiaryFormDTO } from './dto/diary-form.dto';

@Injectable()
export class DiariesService {
  constructor(
    @InjectRepository(DiaryEntity)
    private readonly diaryRepository: Repository<DiaryEntity>,
  ) {}

  async getAll() {
    const diaries = await this.diaryRepository
      .createQueryBuilder('diary')
      .leftJoinAndSelect('diary.author', 'author')
      .getMany();

    return diaries;
  }

  async create(diaryFormDto: DiaryFormDTO, author: UserDTO) {
    const { title, content, imgUrl } = diaryFormDto;

    const newDiary = await this.diaryRepository.create({
      title,
      content,
      imgUrl,
      author,
    });

    return await this.diaryRepository.save(newDiary);
  }
}
