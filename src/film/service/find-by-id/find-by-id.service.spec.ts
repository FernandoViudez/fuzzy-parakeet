import { Test, TestingModule } from '@nestjs/testing';
import { FilmRepository } from '../../repository/film.repository';
import { Film } from '../../schema/types/film.type';
import { FindOneFilmService } from './find-by-id.service';
import { FindOneReqDto } from '../../dto/find-one.dto';

describe('Find one film service should: ', () => {
  let module: TestingModule;
  let service: FindOneFilmService;
  let mockReq: FindOneReqDto;
  let mockFilm: Film;
  const createdAt = new Date();
  const updatedAt = new Date();

  beforeEach(async () => {
    mockReq = {
      filmId: 'flm_1',
    };
    mockFilm = {
      characters: '[]',
      created: 'asd',
      createdAt: createdAt,
      director: 'asd',
      edited: 'asd',
      episode_id: 1,
      filmId: 'flm_1',
      opening_crawl: 'lorem',
      planets: '[]',
      producer: 'asd',
      release_date: 'asd',
      species: '[]',
      starships: '[]',
      title: 'asd',
      updatedAt: updatedAt,
      url: 'asd',
      vehicles: '[]',
      externalId: '1',
    };
    module = await Test.createTestingModule({
      providers: [
        FindOneFilmService,
        {
          provide: FilmRepository,
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockFilm),
          },
        },
      ],
    }).compile();

    service = module.get<FindOneFilmService>(FindOneFilmService);
  });

  test('fail if film not found', async () => {
    module.get<FilmRepository>(FilmRepository).findOne = jest
      .fn()
      .mockResolvedValue(null);

    const promise = service.execute(mockReq);

    expect(promise).rejects.toThrow(
      `Film not found with id: ${mockReq.filmId || mockReq.title}`,
    );
  });

  test('return film with valid format', async () => {
    const films = await service.execute(mockReq);

    expect(films).toEqual({
      characters: [],
      created: 'asd',
      createdAt,
      director: 'asd',
      edited: 'asd',
      episode_id: 1,
      filmId: 'flm_1',
      opening_crawl: 'lorem',
      planets: [],
      producer: 'asd',
      release_date: 'asd',
      species: [],
      starships: [],
      title: 'asd',
      updatedAt,
      url: 'asd',
      vehicles: [],
      externalId: '1',
    });
  });
});
