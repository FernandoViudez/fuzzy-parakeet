import {
  Table,
  Column,
  DataType,
  AllowNull,
  Index,
  Unique,
} from 'sequelize-typescript';
import { User } from './types/user.type';
import { BaseModel } from '../../common/schema/base-model.model';
import { Role } from '../../common/enum/role.enum';
import { createPrefixedId } from '../../common/helpers/create-prefixed-id';

const USER_PREFIX = 'usr';
@Table({ tableName: 'User' })
export class UserModel extends BaseModel implements User {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    defaultValue: () => createPrefixedId(USER_PREFIX),
  })
  userId: string;

  @Index
  @Unique
  @Column(DataType.STRING)
  email: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  password: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string;

  @AllowNull(false)
  @Column(DataType.SMALLINT)
  age: number;

  @AllowNull(true)
  @Column(DataType.STRING)
  phone?: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM,
    values: [Role.admin, Role.user],
  })
  role: Role;
}
