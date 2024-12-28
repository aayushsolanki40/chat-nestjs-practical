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
import { successDataResponse } from '@/shared/common/response.common';

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
  async findAllGroups(@Res() res: Response) {
    const data = await this.chatService.findAllGroups();
    return successDataResponse(res, 'Group fetched', data);
  }

  @Post('group/invite')
  inviteMember(@Body() inviteMemberDto: InviteMemberDto) {
    return this.chatService.inviteMember(inviteMemberDto);
  }

  @Delete('group/:groupId/member/:userId')
  removeMember(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
  ) {
    return this.chatService.removeMember(groupId, userId);
  }
}
