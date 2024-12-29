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
import { JwtCookieGuard } from '@/shared/guards/jwt-cookies.guard';
import {
  successDataResponse,
  successResponse,
} from '@/shared/common/response.common';
import { Request, Response } from 'express';

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
  @Get('me')
  getProfile(@Req() req: Request, @Res() response: Response) {
    return successDataResponse(response, 'User information fetched.', req.user); // Returns user info from the JWT payload
  }
}
