import { Entity, ManyToOne } from 'typeorm';
import { ChatGroup } from './chat-group.entity';
import { User } from '@modules/users/entities/user.entity';
import { BaseEntity } from '@/shared/entity/base.entity';

@Entity('group_members')
export class GroupMember extends BaseEntity {
  @ManyToOne(() => ChatGroup, (chatGroup) => chatGroup.members, {
    onDelete: 'CASCADE',
  })
  chatGroup: ChatGroup;

  @ManyToOne(() => User, { eager: true })
  user: User;
}
