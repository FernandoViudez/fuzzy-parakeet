import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './service/jwt-strategy.service';
import { ConfigService } from '@nestjs/config';
import { CONFIG_PROVIDER, EnvConfig } from '../config/config';
import { UserSqlRepository } from './repository/user-sql.repository';
import { UserRepository } from './repository/user.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from './schema/user.model';

const repository = {
  provide: UserRepository,
  useClass: UserSqlRepository,
};

@Module({
  imports: [
    SequelizeModule.forFeature([UserModel]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService<EnvConfig>) => ({
        secretOrPrivateKey: configService.get('jwtSecret'),
        signOptions: {
          algorithm: 'HS256',
          expiresIn: configService.get('jwtExpiresIn'),
        },
      }),
      inject: [CONFIG_PROVIDER],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, repository],
})
export class AuthModule {}
