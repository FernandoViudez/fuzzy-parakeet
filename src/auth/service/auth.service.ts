import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { UserRepository } from '../repository/user.repository';
import { Role } from '../../common/enum/role.enum';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserReq } from '../../common/types/req-user.type';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(req: LoginDto) {
    const user = await this.userRepository.findOne({
      email: req.email,
    });

    if (!user) {
      throw new BadRequestException('Unauthorized: Incorrect credentials');
    }

    const isMatch = bcrypt.compare(req.password, user.password);

    if (!isMatch) {
      throw new BadRequestException('Unauthorized: Incorrect credentials');
    }

    return this.jwtService.sign({
      userId: user.userId,
      email: user.email,
      role: user.role,
    });
  }

  async register(req: RegisterDto, user?: UserReq) {
    const { age, email, name, password, phone } = req;

    const hash = await bcrypt.hash(password, 10);
    const role = this.getRoleFromUser(req, user);

    try {
      await this.userRepository.create({
        name,
        age,
        email,
        role,
        password: hash,
        ...(phone && { phone }),
      });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException(
          'User already exists, try to login instead',
        );
      }

      this.logger.error(error);
      throw error;
    }
  }

  private getRoleFromUser(req: RegisterDto, user?: UserReq) {
    if (!user) return Role.user;

    if (user.role === Role.admin) {
      return req.role || Role.user;
    }

    if (user.role === Role.user) {
      return Role.user;
    }

    throw new InternalServerErrorException(
      `Data inconsistency: user role ${user.role} is not a valid value`,
    );
  }
}
