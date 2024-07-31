import { Queryable, QueryOptions } from '../types/sequelize.type';
import { Attributes, FindOptions } from 'sequelize/types/model';
import { Model } from 'sequelize-typescript';

type FindOptionsWithWhere<T extends Model> = FindOptions<Attributes<T>> &
  Required<Pick<FindOptions<Attributes<T>>, 'where'>>;

export class CustomTypesToSequelizeMapper {
  private static readonly DEFAULT_OPTIONS = {
    raw: true,
    nest: true,
    subQuery: false,
  } as const;

  public static toQueryOptions<T extends Model>(
    filter: Queryable<T>,
    options?: QueryOptions<T>,
  ): FindOptionsWithWhere<T> {
    const moreOptions = this.mapMoreOptions(options);

    return {
      ...this.DEFAULT_OPTIONS,
      where: filter,
      ...moreOptions,
    } as FindOptionsWithWhere<Attributes<T>>;
  }

  private static mapMoreOptions(options?: QueryOptions<never>) {
    if (!options) return;

    return (
      options && {
        ...(options.attributes ? { attributes: options.attributes } : {}),
        ...(options.includeDeleted
          ? { paranoid: !options.includeDeleted }
          : {}),
        ...(options.order ? { order: options.order } : {}),
        ...(options.transaction ? { transaction: options.transaction } : {}),
        ...(Number.isFinite(options.limit) ? { limit: options.limit } : {}),
        ...(Number.isFinite(options.offset) ? { offset: options.offset } : {}),
      }
    );
  }
}
