import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { UserToTermsAgreementEntity } from 'src/user-to-terms-agreements/user-to-terms-agreements.entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('termsAgreementId', ['id'], { unique: true })
@Entity({
  name: 'TERMS_AGREEMENT',
})
export class TermsAgreementEntity {
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
}
