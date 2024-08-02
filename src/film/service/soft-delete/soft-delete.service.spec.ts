import { Test, TestingModule } from '@nestjs/testing';
import { FilmRepository } from '../../repository/film.repository';
import { DeleteFilmService } from './soft-delete.service';
import { DeleteFilmReqDto } from '../../dto/delete.dto';

describe('Delete film service should: ', () => {
  let module: TestingModule;
  let service: DeleteFilmService;
  let mockReq: DeleteFilmReqDto;

  beforeEach(async () => {
    mockReq = {
      filmId: 'flm_1',
    };
    module = await Test.createTestingModule({
      providers: [
        DeleteFilmService,
        {
          provide: FilmRepository,
          useValue: {
            delete: jest.fn().mockResolvedValue(1),
          },
        },
      ],
    }).compile();

    service = module.get<DeleteFilmService>(DeleteFilmService);
  });

  test('fail if could not delete the film', async () => {
    module.get<FilmRepository>(FilmRepository).delete = jest
      .fn()
      .mockResolvedValue(0);

    const promise = service.execute(mockReq);

    await expect(promise).rejects.toThrow(
      `Could not delete your film with id ${mockReq.filmId}`,
    );
  });

  test('delete the film correctly', async () => {
    const deleteSpy = jest.spyOn(
      module.get<FilmRepository>(FilmRepository),
      'delete',
    );

    await service.execute(mockReq);

    expect(deleteSpy).toHaveBeenCalledTimes(1);
    expect(deleteSpy).toHaveBeenCalledWith({
      filmId: mockReq.filmId,
    });
  });
});
