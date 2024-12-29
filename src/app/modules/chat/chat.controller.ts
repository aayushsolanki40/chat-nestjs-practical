import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Get,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatGroupDto } from './dto/create-chat-group.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { Request, Response } from 'express';
import { JwtCookieGuard } from '@/shared/guards/jwt-cookies.guard';
import {
  successDataResponse,
  successResponse,
} from '@/shared/common/response.common';
import { CHAT_STRING } from '@/constant/string.config';

@Controller('chat')
@UseGuards(JwtCookieGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('group')
  createGroup(
    @Req() req: Request,
    @Body() createChatGroupDto: CreateChatGroupDto,
  ) {
    const userId = req.user.id;
    return this.chatService.createGroup(userId, createChatGroupDto);
  }

  @Get('groups')
  async findAllGroups(@Req() request: Request, @Res() res: Response) {
    const data = await this.chatService.findAllGroups(request.user.id);
    return successDataResponse(res, 'Group fetched', data);
  }

  @Get('group/:groupId/members')
  async findAllGroupsMembers(
    @Param('groupId') groupId: string,
    @Res() res: Response,
  ) {
    const data = await this.chatService.findAllGroupsMembers(groupId);
    return successDataResponse(
      res,
      CHAT_STRING.SUCCESS.GROUP_MEMBER_FETCHED,
      data,
    );
  }

  @Post('group/invite')
  async inviteMember(
    @Body() inviteMemberDto: InviteMemberDto,
    @Res() res: Response,
  ) {
    await this.chatService.inviteMember(inviteMemberDto);
    return successResponse(
      res,
      CHAT_STRING.SUCCESS.MEMBER_HAS_BEEN_ADDED_IN_CHAT,
    );
  }

  @Delete('group/:groupId/member/:userId')
  async removeMember(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
    @Res() res: Response,
  ) {
    await this.chatService.removeMember(groupId, userId);
    return successResponse(res, CHAT_STRING.SUCCESS.INVITED_MEMBER_REMOVED);
  }
}
