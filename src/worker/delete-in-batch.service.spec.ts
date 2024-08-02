import { Test, TestingModule } from '@nestjs/testing';
import { FilmRepository } from '../film/repository/film.repository';
import { DeleteInBatchService } from './delete-in-batch.service';
import { Film } from '../film/schema/types/film.type';
import { CONFIG_PROVIDER } from '../config/config';

describe('Delete in batch films service should: ', () => {
  let module: TestingModule;
  let service: DeleteInBatchService;
  let extraFilms: Film[];

  beforeEach(async () => {
    extraFilms = [
      {
        characters: '[]',
        created: 'asd',
        director: 'asd',
        edited: 'asd',
        episode_id: 1,
        opening_crawl: 'asd',
        planets: '[]',
        producer: 'asd',
        release_date: 'asd',
        species: '[]',
        starships: '[]',
        title: 'asd',
        url: 'asd',
        vehicles: '[]',
        createdAt: new Date(),
        filmId: 'flm_1',
        updatedAt: new Date(),
        externalId: '1',
      },
    ];

    module = await Test.createTestingModule({
      providers: [
        DeleteInBatchService,
        {
          provide: FilmRepository,
          useValue: {
            delete: jest.fn().mockResolvedValue(1),
          },
        },
        {
          provide: CONFIG_PROVIDER,
          useValue: {
            get: jest.fn().mockReturnValue(false),
          },
        },
      ],
    }).compile();

    service = module.get<DeleteInBatchService>(DeleteInBatchService);
  });

  test('do nothing if no records to delete', async () => {
    const filmDeleteSpy = jest.spyOn(module.get(FilmRepository), 'delete');
    await service.execute([]);

    expect(filmDeleteSpy).toHaveBeenCalledTimes(0);
  });

  test('not delete local films if config is in false', async () => {
    const spyLog = jest.spyOn(service['logger'], 'log');
    const filmDeleteSpy = jest.spyOn(module.get(FilmRepository), 'delete');
    extraFilms[0].externalId = undefined;

    await service.execute(extraFilms);

    expect(filmDeleteSpy).toHaveBeenCalledTimes(0);
    expect(spyLog).toHaveBeenCalledWith(`0 films deleted successfully`);
    expect(spyLog).toHaveBeenCalledWith(
      `0 films deletion FAILED. Failure externalIds: []`,
    );
  });

  test('delete local films if config is in true', async () => {
    module.get(CONFIG_PROVIDER).get = jest.fn().mockReturnValue(true);
    const spyLog = jest.spyOn(service['logger'], 'log');
    const filmDeleteSpy = jest.spyOn(module.get(FilmRepository), 'delete');
    extraFilms[0].externalId = undefined;

    await service.execute(extraFilms);

    expect(filmDeleteSpy).toHaveBeenCalledTimes(1);
    expect(spyLog).toHaveBeenCalledWith(`1 films deleted successfully`);
    expect(spyLog).toHaveBeenCalledWith(
      `0 films deletion FAILED. Failure externalIds: []`,
    );
  });

  test('log error if could not delete a film', async () => {
    const spyLog = jest.spyOn(service['logger'], 'error');
    module.get(FilmRepository).delete = jest.fn().mockResolvedValue(0);

    await service.execute(extraFilms);

    expect(spyLog).toHaveBeenCalledWith(
      `Error deleting extra film with id flm_1`,
    );
  });

  test('log error if could not delete a film', async () => {
    const spyLog = jest.spyOn(service['logger'], 'log');
    const deleteSpy = jest.spyOn(module.get(FilmRepository), 'delete');

    await service.execute(extraFilms);

    expect(spyLog).toHaveBeenCalledWith(`1 films deleted successfully`);
    expect(deleteSpy).toHaveBeenCalledWith({
      filmId: 'flm_1',
    });
  });
});
