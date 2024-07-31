import { Role } from '../../../common/enum/role.enum';
import { BaseModel } from '../../../common/schema/base-mode.type';

export interface User extends BaseModel {
  userId: string;
  name: string;
  email: string;
  password: string;
  age: number;
  phone?: string;
  role: Role;
}
