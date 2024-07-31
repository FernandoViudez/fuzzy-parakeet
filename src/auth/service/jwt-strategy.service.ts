import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CONFIG_PROVIDER, EnvConfig } from '../../config/config';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(CONFIG_PROVIDER) configService: ConfigService<EnvConfig>,
    @Inject(UserRepository) private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwtSecret'),
    });
  }

  async validate(payload: any) {
    const user = await this.userRepository.findOne({
      userId: payload.userId,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return { userId: user.userId, role: user.role };
  }
}
