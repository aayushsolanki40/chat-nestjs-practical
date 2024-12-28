import { Entity, Column, Unique } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '@/shared/entity/base.entity';

@Entity('users')
@Unique(['username'])
export class User extends BaseEntity {
  @Column()
  username: string;

  @Exclude()
  @Column()
  password: string;
}
