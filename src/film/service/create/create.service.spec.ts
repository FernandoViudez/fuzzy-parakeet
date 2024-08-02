import { Test, TestingModule } from '@nestjs/testing';
import { CreateFilmService } from './create.service';
import { FilmRepository } from '../../repository/film.repository';
import { CreateFilmReqDto } from '../../dto/create.dto';
import { CustomDbError } from '../../../common/tests/custom-db-error';

describe('Create film service should: ', () => {
  let module: TestingModule;
  let service: CreateFilmService;
  let mockReq: CreateFilmReqDto;

  beforeEach(async () => {
    mockReq = {
      characters: [],
      vehicles: [],
      planets: [],
      species: [],
      starships: [],
      created: new Date().toISOString(),
      director: 'test',
      edited: new Date().toISOString(),
      episode_id: 1,
      opening_crawl: 'lorem...',
      producer: 'asd',
      release_date: new Date().toISOString(),
      title: 'asd',
      url: 'asd',
    };
    module = await Test.createTestingModule({
      providers: [
        CreateFilmService,
        {
          provide: FilmRepository,
          useValue: {
            create: jest.fn().mockResolvedValue({ filmId: 'flm_1' }),
          },
        },
      ],
    }).compile();

    service = module.get<CreateFilmService>(CreateFilmService);
  });

  test('fail if film already exists with the id provided', async () => {
    module.get<FilmRepository>(FilmRepository).create = jest
      .fn()
      .mockRejectedValue(new CustomDbError('SequelizeUniqueConstraintError'));

    const promise = service.execute(mockReq);

    await expect(promise).rejects.toThrow(`Film already exists`);
  });

  test('create the film correctly', async () => {
    const createSpy = jest.spyOn(
      module.get<FilmRepository>(FilmRepository),
      'create',
    );

    await service.execute(mockReq);

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledWith({
      characters: JSON.stringify(mockReq.characters),
      created: mockReq.created,
      director: mockReq.director,
      edited: mockReq.edited,
      episode_id: mockReq.episode_id,
      opening_crawl: mockReq.opening_crawl,
      planets: JSON.stringify(mockReq.planets),
      producer: mockReq.producer,
      release_date: mockReq.release_date,
      species: JSON.stringify(mockReq.species),
      starships: JSON.stringify(mockReq.starships),
      title: mockReq.title,
      url: mockReq.url,
      vehicles: JSON.stringify(mockReq.vehicles),
    });
  });
});
