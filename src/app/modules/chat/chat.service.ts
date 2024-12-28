import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatGroup } from './entities/chat-group.entity';
import { GroupMember } from './entities/group-member.entity';
import { CreateChatGroupDto } from './dto/create-chat-group.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatGroup)
    private chatGroupRepository: Repository<ChatGroup>,
    @InjectRepository(GroupMember)
    private groupMemberRepository: Repository<GroupMember>,
    private userService: UsersService,
  ) {}

  async createGroup(
    userId: string,
    createChatGroupDto: CreateChatGroupDto,
  ): Promise<ChatGroup> {
    const creator = await this.userService.findOne(userId);

    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    const chatGroup = this.chatGroupRepository.create({
      name: createChatGroupDto.name,
      creator,
    });

    return this.chatGroupRepository.save(chatGroup);
  }

  async findAllGroups(): Promise<ChatGroup[]> {
    return this.chatGroupRepository.find({ relations: ['creator', 'members'] });
  }

  async inviteMember(inviteMemberDto: InviteMemberDto): Promise<GroupMember> {
    const { groupId, userId } = inviteMemberDto;

    const chatGroup = await this.chatGroupRepository.findOne({
      where: { id: groupId },
    });
    if (!chatGroup) {
      throw new NotFoundException('Chat group not found');
    }

    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingMember = await this.groupMemberRepository.findOne({
      where: { chatGroup: { id: groupId }, user: { id: userId } },
    });
    if (existingMember) {
      throw new BadRequestException('User already a member of the group');
    }

    const groupMember = this.groupMemberRepository.create({
      chatGroup,
      user,
    });

    return this.groupMemberRepository.save(groupMember);
  }

  async removeMember(groupId: string, userId: string): Promise<void> {
    const member = await this.groupMemberRepository.findOne({
      where: { chatGroup: { id: groupId }, user: { id: userId } },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    await this.groupMemberRepository.remove(member);
  }
}
