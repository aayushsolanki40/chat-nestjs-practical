import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { JwtCookieGuard } from '@/shared/guards/jwt-cookies.guard';
import { successResponse } from '@/shared/common/response.common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto, @Res() response: Response) {
    const res = await this.usersService.signup(signupDto);
    return successResponse(response, res);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() response: Response) {
    return this.usersService.login(loginDto, response);
  }

  @UseGuards(JwtCookieGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user; // Returns user info from the JWT payload
  }
}
