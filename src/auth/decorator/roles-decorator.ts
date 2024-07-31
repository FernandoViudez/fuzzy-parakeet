import { SetMetadata } from '@nestjs/common';
import { ROLE_KEY } from '../../common/enum/role.enum';

export const Roles = (roles) => SetMetadata(ROLE_KEY, roles);
