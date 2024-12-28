import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatGroup } from './entities/chat-group.entity';
import { GroupMember } from './entities/group-member.entity';
import { CreateChatGroupDto } from './dto/create-chat-group.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UsersService } from '../users/users.service';
import { CHAT_STRING } from '@/constant/string.config';
import { instanceToPlain } from 'class-transformer';

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
      throw new NotFoundException(CHAT_STRING.ERROR.CREATOR_NOT_FOUND);
    }

    const isExists = await this.chatGroupRepository.findOneBy({
      name: createChatGroupDto.name,
    });

    if (isExists) {
      throw new ConflictException(CHAT_STRING.ERROR.GROUP_NAME_EXISTS);
    }

    const chatGroup = this.chatGroupRepository.create({
      name: createChatGroupDto.name,
      creator,
    });

    const result = await this.chatGroupRepository.save(chatGroup);
    return instanceToPlain(result) as ChatGroup;
  }

  async findAllGroups(): Promise<ChatGroup[]> {
    return instanceToPlain(this.chatGroupRepository.find()) as Array<ChatGroup>;
  }

  async findAllGroupsMembers(groupId: string): Promise<GroupMember[]> {
    return instanceToPlain(
      this.groupMemberRepository.findBy({ chatGroup: { id: groupId } }),
    ) as Array<GroupMember>;
  }

  async inviteMember(inviteMemberDto: InviteMemberDto): Promise<GroupMember> {
    const { groupId, username } = inviteMemberDto;

    const chatGroup = await this.chatGroupRepository.findOne({
      where: { id: groupId },
    });
    if (!chatGroup) {
      throw new NotFoundException(CHAT_STRING.ERROR.CHAT_NOT_FOUND);
    }

    const user = await this.userService.findOneByUsername(username);
    if (!user) {
      throw new NotFoundException(CHAT_STRING.ERROR.USER_NOT_FOUND);
    }

    const existingMember = await this.groupMemberRepository.findOne({
      where: { chatGroup: { id: groupId }, user: { id: user.id } },
    });
    if (existingMember) {
      throw new ConflictException(CHAT_STRING.ERROR.USER_ALREADY_MEMBER);
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
      throw new NotFoundException(CHAT_STRING.ERROR.MEMBER_NOT_FOUND);
    }

    await this.groupMemberRepository.remove(member);
  }
}
