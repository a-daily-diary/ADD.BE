import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
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
  @IsString()
  @IsNotEmpty({ message: '약관동의 내용을 작성하세요.' })
  @Column({ type: 'text', nullable: false })
  content: string;

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
