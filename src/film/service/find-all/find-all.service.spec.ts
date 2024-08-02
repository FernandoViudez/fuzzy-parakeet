import { Test, TestingModule } from '@nestjs/testing';
import { FindAllFilmsService } from './find-all.service';
import { FilmRepository } from '../../repository/film.repository';
import { FindAllReqDto } from '../../dto/find-all.dto';
import { Film } from '../../schema/types/film.type';

describe('Find all films service should: ', () => {
  let module: TestingModule;
  let service: FindAllFilmsService;
  let mockReq: FindAllReqDto;
  let mockFilm: Film;
  const createdAt = new Date();
  const updatedAt = new Date();

  beforeEach(async () => {
    mockReq = {};
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
        FindAllFilmsService,
        {
          provide: FilmRepository,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockFilm]),
          },
        },
      ],
    }).compile();

    service = module.get<FindAllFilmsService>(FindAllFilmsService);
  });

  test('return films with valid format', async () => {
    const films = await service.execute(mockReq);

    expect(films).toEqual({
      films: [
        {
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
        },
      ],
      limit: expect.any(Number),
      offset: expect.any(Number),
    });
  });
});
