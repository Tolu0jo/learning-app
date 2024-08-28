import { IsString } from 'class-validator';

export class CreateCompletionDto {
  @IsString()
  userId: string;

  @IsString()
  topicId: string;

  @IsString()
  subjectId: string;
}
