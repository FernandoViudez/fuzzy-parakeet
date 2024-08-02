import { Test, TestingModule } from '@nestjs/testing';
import { FilmRepository } from '../film/repository/film.repository';
import { ExternalFilm } from '../common/types/external-film';
import { UpdateAndSyncFilmsService } from './update.service';
import { Film } from '../film/schema/types/film.type';
import * as _ from 'lodash';
describe('Update and sync films service should: ', () => {
  let module: TestingModule;
  let service: UpdateAndSyncFilmsService;
  let externalFilm: ExternalFilm;
  let localFilm: Film;
  const params: {
    matchingIds: string[];
    externalFilmsMap: Map<string, ExternalFilm>;
    localFilmsMap: Map<string, Film>;
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
    localFilm = {
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
    };
    params.externalFilmsMap = new Map<string, ExternalFilm>();
    params.externalFilmsMap.set('1', externalFilm);
    params.localFilmsMap = new Map<string, Film>();
    params.localFilmsMap.set('1', localFilm);
    params.matchingIds = ['1'];

    module = await Test.createTestingModule({
      providers: [
        UpdateAndSyncFilmsService,
        {
          provide: FilmRepository,
          useValue: {
            update: jest.fn().mockResolvedValue([1]),
          },
        },
      ],
    }).compile();

    service = module.get<UpdateAndSyncFilmsService>(UpdateAndSyncFilmsService);
  });

  test('do nothing if no records to update', async () => {
    const filmUpdateSpy = jest.spyOn(module.get(FilmRepository), 'update');
    await service.execute([], params.externalFilmsMap, params.localFilmsMap);

    expect(filmUpdateSpy).toHaveBeenCalledTimes(0);
  });

  test('do nothing if no changes over both films', async () => {
    jest.spyOn(_, 'isEqual').mockImplementation(() => true);
    const filmUpdateSpy = jest.spyOn(module.get(FilmRepository), 'update');
    const spyLog = jest.spyOn(service['logger'], 'log');

    await service.execute(
      params.matchingIds,
      params.externalFilmsMap,
      params.localFilmsMap,
    );

    expect(filmUpdateSpy).toHaveBeenCalledTimes(0);
    expect(spyLog).toHaveBeenCalledWith(`Skipping 1 due equality`);
  });

  test('update local film if changes over one of both films', async () => {
    jest.spyOn(_, 'isEqual').mockImplementation(() => false);

    const filmUpdateSpy = jest.spyOn(module.get(FilmRepository), 'update');
    const spyLog = jest.spyOn(service['logger'], 'log');
    const localFilm = params.localFilmsMap.get('1');
    localFilm.director = 'another different director';
    params.localFilmsMap.set('1', localFilm);

    await service.execute(
      params.matchingIds,
      params.externalFilmsMap,
      params.localFilmsMap,
    );

    expect(filmUpdateSpy).toHaveBeenCalledTimes(1);
    expect(spyLog).toHaveBeenCalledWith(`1 films synced successfully`);
    expect(filmUpdateSpy).toHaveBeenCalledWith(expect.anything(), {
      externalId: '1',
    });
  });
});
