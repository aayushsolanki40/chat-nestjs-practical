import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AUTH_STRING } from '@/constant/string.config';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { successResponse } from '@/shared/common/response.common';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<string> {
    const { username, password } = signupDto;

    const existingUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new BadRequestException(AUTH_STRING.ERROR.USER_ALREADY_TAKEN);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });
    await this.userRepository.save(user);

    return AUTH_STRING.SUCCESS.SIGNUP_SUCCESS;
  }

  async login(loginDto: LoginDto, response: Response): Promise<Response> {
    const { username, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException(
        AUTH_STRING.ERROR.INVALID_USERNAME_PASSWORD,
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        AUTH_STRING.ERROR.INVALID_USERNAME_PASSWORD,
      );
    }

    const payload = { sub: user.id, username: user.username };
    const token = this.jwtService.sign(payload);

    // Set cookie with secure and HttpOnly flags
    response.cookie('jwt', token, {
      httpOnly: true,
      secure: true, // Set this to `true` in production when using HTTPS
      sameSite: 'strict', // Helps mitigate CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return successResponse(response, AUTH_STRING.SUCCESS.LOGIN_SUCCESS);
  }

  async findOne(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  async findOneByUsername(username: string) {
    return this.userRepository.findOneBy({ username });
  }
}
