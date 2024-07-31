import { Transaction } from 'sequelize';
import { OrderType } from '../enum/order.enum';

export type Queryable<T> = {
  [P in keyof T]?: T[P] | T[P][];
};

type OrderBy<T> = Array<[keyof T, OrderType]>;

export type QueryOptions<T> = {
  attributes?: (keyof T)[];
  includeDeleted?: boolean;
  order?: OrderBy<T>;
  transaction?: Transaction;

  limit?: number;
  offset?: number;
};

export type CreationAttributes<T> = Omit<
  T,
  'createdAt' | 'updatedAt' | 'deletedAt'
>;
