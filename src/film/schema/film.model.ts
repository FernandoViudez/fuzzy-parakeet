import {
  Table,
  Column,
  DataType,
  AllowNull,
  Index,
  createIndexDecorator,
} from 'sequelize-typescript';
import { BaseModel } from '../../common/schema/base-model.model';
import { createPrefixedId } from '../../common/helpers/create-prefixed-id';
import { Film } from './types/film.type';
import { Op } from 'sequelize';

const ExternalIdNotNullIndex = createIndexDecorator({
  name: 'external_id',
  unique: true,
  where: {
    externalId: { [Op.not]: null },
    deletedAt: null,
  },
});

const FILM_PREFIX = 'flm';
@Table({ tableName: 'Film' })
export class FilmModel extends BaseModel implements Film {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    defaultValue: () => createPrefixedId(FILM_PREFIX),
  })
  filmId: string;

  @AllowNull(true)
  @ExternalIdNotNullIndex
  @Column(DataType.STRING)
  externalId?: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  title: string;

  @AllowNull(false)
  @Column(DataType.SMALLINT)
  episode_id: number;

  @AllowNull(false)
  @Column(DataType.TEXT)
  opening_crawl: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  director: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  producer: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  release_date: string;

  // TODO: consider using postgres for arrays
  @AllowNull(false)
  @Column(DataType.TEXT)
  species: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  starships: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  vehicles: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  characters: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  planets: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  url: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  created: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  edited: string;
}
