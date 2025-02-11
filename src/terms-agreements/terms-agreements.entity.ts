import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TermsAgreementEnum } from 'src/types/terms-agreements.type';
import { UserToTermsAgreementEntity } from 'src/user-to-terms-agreements/user-to-terms-agreements.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { TermsContent } from './dto/terms-content.dto';

@Index('termsAgreementId', ['id'], { unique: true })
@Entity({
  name: 'TERMS_AGREEMENT',
})
export class TermsAgreementEntity {
  @ApiProperty()
  @IsEnum(TermsAgreementEnum)
  @PrimaryColumn({ enum: TermsAgreementEnum })
  id: TermsAgreementEnum;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: '약관동의 이름을 작성하세요.' })
  @Column({ type: 'varchar', nullable: false })
  title: string;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true }) // 배열 내부의 객체 검사
  @Type(() => TermsContent) // 객체 타입 변환
  @Column({ type: 'jsonb', nullable: false })
  contents: TermsContent[];

  @ApiProperty()
  @IsBoolean()
  @Column({ nullable: false })
  isRequired: boolean;

  @ApiProperty()
  @OneToMany(
    () => UserToTermsAgreementEntity,
    (userToTermsAgreement) => userToTermsAgreement.termsAgreement,
    {
      cascade: true,
    },
  )
  userToTermsAgreements: UserToTermsAgreementEntity[];

  @CreateDateColumn({
    type: 'timestamptz' /* timestamp with time zone */,
  })
  createdAt: Date;
}
