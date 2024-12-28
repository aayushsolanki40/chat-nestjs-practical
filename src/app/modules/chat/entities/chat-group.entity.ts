import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '@modules/users/entities/user.entity';
import { BaseEntity } from '@/shared/entity/base.entity';
import { GroupMember } from './group-member.entity';

@Entity('chat_groups')
export class ChatGroup extends BaseEntity {
  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.chatGroups, { eager: true })
  creator: User;

  @OneToMany(() => GroupMember, (member) => member.chatGroup, { cascade: true })
  members: GroupMember[];
}
