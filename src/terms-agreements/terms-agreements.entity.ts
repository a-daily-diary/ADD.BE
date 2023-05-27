import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('termsAgreementId', ['id'], { unique: true })
@Entity({
  name: 'TERMS_AGREEMENT',
})
export class TermsAgreementEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: '약관동의 이름을 작성하세요.' })
  @Column({ type: 'varchar', nullable: false })
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: '약관동의 내용을 작성하세요.' })
  @Column({ type: 'text', nullable: false })
  content: string;

  @ApiProperty()
  @IsBoolean()
  @Column({ nullable: false })
  isRequired: boolean;
}
