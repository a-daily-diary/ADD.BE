import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsUUID } from 'class-validator';
import { TermsAgreementEntity } from 'src/terms-agreements/terms-agreements.entity';
import { UserEntity } from 'src/users/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('userToTermsAgreementId', ['id'], { unique: true })
@Entity({
  name: 'USER_TO_TERMS_AGREEMENT',
})
export class UserToTermsAgreementEntity {
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @ManyToOne(
    () => UserEntity,
    (user: UserEntity) => user.userToTermsAgreements,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user: UserEntity;

  @ApiProperty()
  @ManyToOne(
    () => TermsAgreementEntity,
    (termsAgreement: TermsAgreementEntity) =>
      termsAgreement.userToTermsAgreements,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'termsAgreement_id',
    referencedColumnName: 'id',
  })
  termsAgreement: TermsAgreementEntity;

  @ApiProperty()
  @IsBoolean()
  @Column({ nullable: false })
  isAgreed: boolean;

  @CreateDateColumn({
    type: 'timestamptz' /* timestamp with time zone */,
  })
  createdAt: Date;
}
