import { Queryable, QueryOptions } from '../../common/types/sequelize.type';
import { UserModel } from '../schema/user.model';

export interface UserRepository {
  findAll(
    filter: Queryable<UserModel>,
    options?: QueryOptions<UserModel>,
  ): Promise<UserModel[]>;
  findOne(
    filter: Queryable<UserModel>,
    options?: QueryOptions<UserModel>,
  ): Promise<UserModel | null>;
  create(
    entity: Partial<UserModel>,
    options?: QueryOptions<UserModel>,
  ): Promise<UserModel>;
  update(
    values: Partial<UserModel>,
    filter: Queryable<UserModel>,
    options?: QueryOptions<UserModel>,
  ): Promise<[number]>;
  delete(
    filter: Queryable<UserModel>,
    options?: QueryOptions<UserModel>,
  ): Promise<number>;
  findWithPassword(
    email: string,
    options?: QueryOptions<UserModel>,
  ): Promise<UserModel | null>;
}

export const UserRepository = Symbol('UserRepository');
