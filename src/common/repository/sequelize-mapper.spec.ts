import { CustomTypesToSequelizeMapper } from './sequelize-mapper';

describe('Sequelize mapper should', () => {
  test('map more options correctly', () => {
    const result = CustomTypesToSequelizeMapper.toQueryOptions({});

    expect(result).toEqual({
      raw: true,
      nest: true,
      subQuery: false,
      where: {},
    });
  });

  test('map more options correctly with include deleted', () => {
    const result = CustomTypesToSequelizeMapper.toQueryOptions(
      {},
      { includeDeleted: true },
    );

    expect(result).toEqual({
      raw: true,
      nest: true,
      subQuery: false,
      where: {},
      paranoid: false,
    });
  });

  test('map more options correctly with attributes', () => {
    const result = CustomTypesToSequelizeMapper.toQueryOptions(
      {},
      { attributes: ['createdAt'] },
    );

    expect(result).toEqual({
      raw: true,
      nest: true,
      subQuery: false,
      where: {},
      attributes: ['createdAt'],
    });
  });

  test('map more options correctly with order', () => {
    const result = CustomTypesToSequelizeMapper.toQueryOptions(
      {},
      { order: [] },
    );

    expect(result).toEqual({
      raw: true,
      nest: true,
      subQuery: false,
      where: {},
      order: [],
    });
  });

  test('map more options correctly with transaction', () => {
    const result = CustomTypesToSequelizeMapper.toQueryOptions(
      {},
      { transaction: {} as any },
    );

    expect(result).toEqual({
      raw: true,
      nest: true,
      subQuery: false,
      where: {},
      transaction: {},
    });
  });

  test('map more options correctly with limit', () => {
    const result = CustomTypesToSequelizeMapper.toQueryOptions(
      {},
      { limit: 1 },
    );

    expect(result).toEqual({
      raw: true,
      nest: true,
      subQuery: false,
      where: {},
      limit: 1,
    });
  });

  test('map more options correctly with offset', () => {
    const result = CustomTypesToSequelizeMapper.toQueryOptions(
      {},
      { offset: 1 },
    );

    expect(result).toEqual({
      raw: true,
      nest: true,
      subQuery: false,
      where: {},
      offset: 1,
    });
  });
});
