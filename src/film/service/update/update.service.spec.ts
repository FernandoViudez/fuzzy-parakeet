import { Test, TestingModule } from '@nestjs/testing';
import { UpdateFilmService } from './update.service';
import { FilmRepository } from '../../repository/film.repository';
import { CustomDbError } from '../../../common/tests/custom-db-error';
import { UpdateFilmReqDto } from '../../dto/update.dto';

describe('Update film service should: ', () => {
  let module: TestingModule;
  let service: UpdateFilmService;
  let mockReq: UpdateFilmReqDto;

  beforeEach(async () => {
    mockReq = {
      filmId: 'flm_1',
      title: 'asd-updated',
      url: 'asd-updated',
    };
    module = await Test.createTestingModule({
      providers: [
        UpdateFilmService,
        {
          provide: FilmRepository,
          useValue: {
            update: jest.fn().mockResolvedValue([1]),
          },
        },
      ],
    }).compile();

    service = module.get<UpdateFilmService>(UpdateFilmService);
  });

  test('fail if film already exists with the id provided', async () => {
    module.get<FilmRepository>(FilmRepository).update = jest
      .fn()
      .mockRejectedValue(new CustomDbError('SequelizeUniqueConstraintError'));

    const promise = service.execute(mockReq);

    await expect(promise).rejects.toThrow(`Film already exists`);
  });

  test('fail if film not found or not updated correctly', async () => {
    module.get<FilmRepository>(FilmRepository).update = jest
      .fn()
      .mockResolvedValue([0]);

    const promise = service.execute(mockReq);

    await expect(promise).rejects.toThrow(
      `Error when updating film with id ${mockReq.filmId}`,
    );
  });

  test('update the film correctly', async () => {
    const updateSpy = jest.spyOn(
      module.get<FilmRepository>(FilmRepository),
      'update',
    );

    await service.execute(mockReq);

    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledWith(
      {
        title: mockReq.title,
        url: mockReq.url,
      },
      {
        filmId: mockReq.filmId,
      },
    );
  });
});
