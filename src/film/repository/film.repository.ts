import { Queryable, QueryOptions } from '../../common/types/sequelize.type';
import { FilmModel } from '../schema/film.model';
import { Film } from '../schema/types/film.type';

export interface FilmRepository {
  findAll(
    filter: Queryable<FilmModel>,
    options?: QueryOptions<FilmModel>,
  ): Promise<FilmModel[]>;
  findOne(
    filter: Queryable<FilmModel>,
    options?: QueryOptions<FilmModel>,
  ): Promise<FilmModel | null>;
  create(
    entity: Partial<FilmModel>,
    options?: QueryOptions<FilmModel>,
  ): Promise<FilmModel>;
  update(
    values: Partial<FilmModel>,
    filter: Queryable<FilmModel>,
    options?: QueryOptions<FilmModel>,
  ): Promise<[number]>;
  delete(
    filter: Queryable<FilmModel>,
    options?: QueryOptions<FilmModel>,
  ): Promise<number>;
}

export type PreCreationFilm = Omit<Film, 'createdAt' | 'updatedAt' | 'filmId'>;
export type PreUpdateFilm = Omit<Film, 'createdAt' | 'updatedAt' | 'filmId'>;

export const FilmRepository = Symbol('FilmRepository');
