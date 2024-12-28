import { IsNotEmpty } from 'class-validator';

export class CreateChatGroupDto {
  @IsNotEmpty()
  name: string;
}
