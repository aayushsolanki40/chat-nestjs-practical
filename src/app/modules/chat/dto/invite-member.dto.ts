import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class InviteMemberDto {
  @IsNotEmpty()
  @IsUUID()
  groupId: string;

  @IsNotEmpty()
  @IsString()
  username: string;
}
