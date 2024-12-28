import { AUTH_STRING } from '@/constant/string.config';
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

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['jwt'];

    if (!token) {
      throw new UnauthorizedException(AUTH_STRING.ERROR.NOT_TOKEN_FOUND);
    }

    try {
      const payload = this.jwtService.verify(token);
      request.user = payload; // Attach user info to request object
      return true;
    } catch (error) {
      throw new UnauthorizedException(AUTH_STRING.ERROR.INVALID_TOKEN);
    }
  }
}
