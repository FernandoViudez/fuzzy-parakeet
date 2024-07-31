import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { Auth } from '../decorator/auth.decorator';
import { Role } from '../../common/enum/role.enum';
import { User } from '../decorator/user.decorator';
import { UserReq } from '../../common/types/req-user.type';
import { Public } from '../decorator/public-ep.decorator';
import { ApiResponse } from '@nestjs/swagger';
import { ApiResponseOk } from '../../common/decorator/ok-response.decorator';
import { EmptyResponse } from '../../common/dto/empty.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponseOk({
    options: {
      description: 'Returns JWT if login succeed',
    },
    type: {},
    addAuth: false,
  })
  @ApiResponse({
    description: 'Returns bad request exception if invalid credentials',
    status: 400,
  })
  @Post('login')
  async login(@Req() req: any, @Body() body: LoginDto): Promise<string> {
    console.log((req as any).user);
    return this.authService.login(body);
  }

  @ApiResponseOk({
    options: {
      description: 'Returns empty response and status 200 if register succeed',
    },
    type: EmptyResponse,
  })
  @ApiResponse({
    description: 'Returns bad request exception if register failed',
    status: 400,
  })
  @Post('register')
  @Public()
  @Auth([Role.admin, Role.user]) // or []
  async register(
    @Body() body: RegisterDto,
    @User() user: UserReq,
  ): Promise<void> {
    return this.authService.register(body, user);
  }
}
