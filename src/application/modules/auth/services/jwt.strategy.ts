import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/services/user.service';
import { JwtPayload } from '../dtos/jwt-payload.dto';
import { User } from '../../user/repositories/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'challenge-secret',
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    try {
      const user = await this.userService.getByUserName(payload.username);
      if (!user) {
        throw new Error('user not found');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error validate user in JWT strategy',
      );
    }
  }
}
