import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, Index } from 'typeorm';

@Index('recommendTopicId', ['id'], { unique: true })
@Entity({
  name: 'RECOMMEND_TOPIC',
})
export class RecommendTopicEntity extends CommonEntity {
  @ApiProperty()
  @IsString()
  @Column({ type: 'varchar' })
  topicEn: string;

  @ApiProperty()
  @IsString()
  @Column({ type: 'varchar' })
  topicKr: string;

  @ApiProperty()
  @IsString()
  @Column({ type: 'varchar' })
  phraseEn: string;

  @ApiProperty()
  @IsString()
  @Column({ type: 'varchar' })
  phraseKr: string;
}
