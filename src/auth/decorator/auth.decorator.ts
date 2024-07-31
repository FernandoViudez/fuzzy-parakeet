import { applyDecorators, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../guard/role.guard';
import { Role } from '../../common/enum/role.enum';
import { Roles } from './roles-decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';

export function Auth(roles: Role[]) {
  return applyDecorators(
    ApiBearerAuth(),
    Roles(roles),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
}
