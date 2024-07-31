import { InjectModel } from '@nestjs/sequelize';
import { BaseSequelizeRepository } from '../../common/repository/base-sql.repository';
import { UserModel } from '../schema/user.model';
import { UserRepository } from './user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserSqlRepository
  extends BaseSequelizeRepository<UserModel>
  implements UserRepository
{
  constructor(@InjectModel(UserModel) model: typeof UserModel) {
    super(model);
  }
}
