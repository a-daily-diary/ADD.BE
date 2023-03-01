import { Exclude } from 'class-transformer';
import { IsUUID } from 'class-validator';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class CommonEntity {
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Postgres의 time zone이 'UTC'리먄 UTC 기분으로 출력하고 'Asia/Seoul'이라면 서울 기준으로 출력한다.
  // DB SQL QUERY : set time zone 'Asia/Seoul'; show timezone;
  @CreateDateColumn({
    type: 'timestamptz' /* timestamp with time zone */,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz' /* timestamp with time zone */,
  })
  updatedAt: Date;

  // Soft Delete : 기존에는 null, 삭제 시 timestamp를 찍는다.
  @Exclude()
  @DeleteDateColumn({ type: 'timestamptz' })
  deleteAt?: Date | null;
}
