import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FilmRepository } from '../../repository/film.repository';
import { DeleteFilmReqDto } from '../../dto/delete.dto';

@Injectable()
export class DeleteFilmService {
  constructor(
    @Inject(FilmRepository) private readonly filmRepository: FilmRepository,
  ) {}

  async execute(req: DeleteFilmReqDto): Promise<void> {
    const deletedCount = await this.filmRepository.delete({
      filmId: req.filmId,
    });

    if (deletedCount !== 1) {
      throw new BadRequestException(
        `Could not delete your film with id ${req.filmId}`,
      );
    }
  }
}
