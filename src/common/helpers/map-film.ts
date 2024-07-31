import { Film } from '../../film/schema/types/film.type';
import { FilmDto } from '../dto/film.dto';

export const mapFilmToResponse = (film: Film): FilmDto => {
  return {
    filmId: film.filmId,
    externalId: film.externalId,
    title: film.title,
    episode_id: film.episode_id,
    opening_crawl: film.opening_crawl,
    director: film.director,
    producer: film.producer,
    release_date: film.release_date,
    species: JSON.parse(film.species),
    starships: JSON.parse(film.starships),
    vehicles: JSON.parse(film.vehicles),
    characters: JSON.parse(film.characters),
    planets: JSON.parse(film.planets),
    url: film.url,
    created: film.created,
    edited: film.edited,
    createdAt: film.createdAt,
    updatedAt: film.updatedAt,
  };
};
