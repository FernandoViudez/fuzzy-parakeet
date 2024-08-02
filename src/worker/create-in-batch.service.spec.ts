import { Test, TestingModule } from '@nestjs/testing';
import { CreateInBatchService } from './create-in-batch.service';
import { FilmRepository } from '../film/repository/film.repository';
import { ExternalFilm } from '../common/types/external-film';
import { CustomDbError } from '../common/tests/custom-db-error';

describe('Crate in batch films service should: ', () => {
  let module: TestingModule;
  let service: CreateInBatchService;
  let externalFilm: ExternalFilm;
  const params: {
    newFilmsIds: string[];
    externalFilmsMap: Map<string, ExternalFilm>;
  } = {} as any;

  beforeEach(async () => {
    externalFilm = {
      characters: [],
      created: 'asd',
      director: 'asd',
      edited: 'asd',
      episode_id: 1,
      opening_crawl: 'asd',
      planets: [],
      producer: 'asd',
      release_date: 'asd',
      species: [],
      starships: [],
      title: 'asd',
      url: 'asd',
      vehicles: [],
    };
    params.externalFilmsMap = new Map<string, ExternalFilm>();
    params.externalFilmsMap.set('1', externalFilm);
    params.newFilmsIds = ['1'];

    module = await Test.createTestingModule({
      providers: [
        CreateInBatchService,
        {
          provide: FilmRepository,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CreateInBatchService>(CreateInBatchService);
  });

  test('do nothing if no records to create', async () => {
    const filmCreateSpy = jest.spyOn(module.get(FilmRepository), 'create');
    await service.execute([], params.externalFilmsMap);

    expect(filmCreateSpy).toHaveBeenCalledTimes(0);
  });

  test('fail if invalid externalId provided in newFilmsIds', async () => {
    const spyLog = jest.spyOn(service['logger'], 'error');
    const filmCreateSpy = jest.spyOn(module.get(FilmRepository), 'create');
    await service.execute(['2'], params.externalFilmsMap);

    expect(filmCreateSpy).toHaveBeenCalledTimes(0);
    expect(spyLog).toHaveBeenCalledWith(
      `Inconsistency data during creation process: Could not get external film with id 2`,
    );
  });

  test('fail if film already exists', async () => {
    const spyLog = jest.spyOn(service['logger'], 'error');

    module.get(FilmRepository).create = jest
      .fn()
      .mockRejectedValue(new CustomDbError('SequelizeUniqueConstraintError'));

    await service.execute(['1'], params.externalFilmsMap);

    expect(spyLog).toHaveBeenCalledWith(`Film with id 1 already exists`);
  });

  test('create films successfully', async () => {
    const spyLog = jest.spyOn(service['logger'], 'log');
    const createSpy = jest.spyOn(module.get(FilmRepository), 'create');

    await service.execute(['1'], params.externalFilmsMap);

    expect(spyLog).toHaveBeenCalledWith(`1 films created successfully`);
    expect(createSpy).toHaveBeenCalledWith({
      externalId: '1',
      title: externalFilm.title,
      episode_id: externalFilm.episode_id,
      opening_crawl: externalFilm.opening_crawl,
      director: externalFilm.director,
      producer: externalFilm.producer,
      release_date: externalFilm.release_date,
      species: JSON.stringify(externalFilm.species),
      starships: JSON.stringify(externalFilm.starships),
      vehicles: JSON.stringify(externalFilm.vehicles),
      characters: JSON.stringify(externalFilm.characters),
      planets: JSON.stringify(externalFilm.planets),
      url: externalFilm.url,
      created: externalFilm.created,
      edited: externalFilm.edited,
    });
  });
});
