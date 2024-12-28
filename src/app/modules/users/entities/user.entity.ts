import { Entity, Column, Unique, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '@/shared/entity/base.entity';
import { ChatGroup } from '../../chat/entities/chat-group.entity';

@Entity('users')
@Unique(['username'])
export class User extends BaseEntity {
  @Column()
  username: string;

  @Exclude()
  @Column()
  password: string;

  @OneToMany(() => ChatGroup, (chatGroup) => chatGroup.creator)
  chatGroups: ChatGroup[];
}
