import { IsDefined, IsString, IsArray, ArrayUnique } from 'class-validator';

export class CreateIntentDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsString()
  topic: string;

  @IsDefined()
  @IsString()
  question: string;

  @IsDefined()
  @IsString()
  answer: string;

  @IsDefined()
  @IsArray()
  @ArrayUnique()
  similarQuestions: string[];
}
