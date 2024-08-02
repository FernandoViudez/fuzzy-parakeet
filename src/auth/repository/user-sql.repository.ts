import { InjectModel } from '@nestjs/sequelize';
import { BaseSequelizeRepository } from '../../common/repository/base-sql.repository';
import { UserModel } from '../schema/user.model';
import { UserRepository } from './user.repository';
import { Injectable } from '@nestjs/common';
import { QueryOptions } from '../../common/types/sequelize.type';

@Injectable()
export class UserSqlRepository
  extends BaseSequelizeRepository<UserModel>
  implements UserRepository
{
  constructor(@InjectModel(UserModel) model: typeof UserModel) {
    super(model);
  }

  async findWithPassword(email: string, options?: QueryOptions<UserModel>) {
    return await this.findOne(
      {
        email,
      },
      {
        attributes: ['password', 'userId', 'email', 'role'],
        ...options,
      },
    );
  }
}
