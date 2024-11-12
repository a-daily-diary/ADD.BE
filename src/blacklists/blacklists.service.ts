import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlacklistEntity } from './blacklist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BlacklistsService {
  constructor(
    @InjectRepository(BlacklistEntity)
    private readonly backlistRepository: Repository<BlacklistEntity>,
  ) {}
}
