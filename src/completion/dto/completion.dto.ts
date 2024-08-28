import { IsString } from 'class-validator';

export class CreateCompletionDto {

  @IsString()
  topicId: string;

  @IsString()
  subjectId: string;
}
