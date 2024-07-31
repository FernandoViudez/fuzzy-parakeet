import { Queryable, QueryOptions } from '../types/sequelize.type';
import { Model, Repository } from 'sequelize-typescript';
import { CustomTypesToSequelizeMapper } from './sequelize-mapper';

export interface IBaseSequelizeRepository<T extends Model> {
  findAll(filter: Queryable<T>, options?: QueryOptions<T>): Promise<T[]>;
  findOne(filter: Queryable<T>, options?: QueryOptions<T>): Promise<T | null>;
  create(entity: Partial<T>, options?: QueryOptions<T>): Promise<T>;
  update(
    values: Partial<T>,
    filter: Queryable<T>,
    options?: QueryOptions<T>,
  ): Promise<[number]>;
  delete(filter: Queryable<T>, options?: QueryOptions<T>): Promise<number>;
}

export abstract class BaseSequelizeRepository<T extends Model>
  implements IBaseSequelizeRepository<T>
{
  protected readonly repository: Repository<T>;

  protected constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  public findAll(
    filter?: Queryable<T>,
    options?: QueryOptions<T>,
  ): Promise<T[]> {
    const sequelizeOptions = CustomTypesToSequelizeMapper.toQueryOptions(
      filter,
      options,
    );
    return this.repository.findAll(sequelizeOptions);
  }

  public create(entity: Partial<T>, options?: QueryOptions<T>): Promise<T> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.repository.create(entity, options);
  }

  public delete(
    filter: Queryable<T>,
    options?: QueryOptions<T>,
  ): Promise<number> {
    const sequelizeOptions = CustomTypesToSequelizeMapper.toQueryOptions(
      filter,
      options,
    );
    return this.repository.destroy(sequelizeOptions);
  }

  public findOne(
    filter: Queryable<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    const sequelizeOptions = CustomTypesToSequelizeMapper.toQueryOptions(
      filter,
      options,
    );

    return this.repository.findOne(sequelizeOptions);
  }

  public async update(
    values: Partial<T>,
    filter: Queryable<T>,
    options?: QueryOptions<T>,
  ): Promise<[number]> {
    const sequelizeOptions = CustomTypesToSequelizeMapper.toQueryOptions(
      filter,
      options,
    );
    return await this.repository.update(values, sequelizeOptions);
  }
}
