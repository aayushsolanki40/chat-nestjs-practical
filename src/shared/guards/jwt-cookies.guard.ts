import { User } from '@/app/modules/users/entities/user.entity';
import { AUTH_STRING, COMMON_ERROR } from '@/constant/string.config';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtCookieGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['jwt'];

    if (!token) {
      throw new UnauthorizedException(AUTH_STRING.ERROR.NOT_TOKEN_FOUND);
    }

    try {
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;
      const user = await User.findOneBy({ id: userId });
      if (!user) {
        throw new UnauthorizedException(COMMON_ERROR.NOT_AUTHENTICATED);
      }
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException(COMMON_ERROR.NOT_AUTHENTICATED);
    }
  }
}
