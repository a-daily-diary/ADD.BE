import { IsString } from 'class-validator';

export class TermsContent {
  @IsString()
  subTitle: string;

  @IsString()
  content: string;
}
