import { IsDefined, IsString } from 'class-validator';

export class CreateTopicDto {
  @IsDefined()
  @IsString()
  name: string;
}
