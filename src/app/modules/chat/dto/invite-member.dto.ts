import { IsNotEmpty, IsUUID } from 'class-validator';

export class InviteMemberDto {
  @IsNotEmpty()
  @IsUUID()
  groupId: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
