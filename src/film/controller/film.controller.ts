import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateFilmService } from '../service/create/create.service';
import { FindAllFilmsService } from '../service/find-all/find-all.service';
import { FindAllReqDto, FindAllResDto } from '../dto/find-all.dto';
import { FindOneReqDto } from '../dto/find-one.dto';
import { FindOneFilmService } from '../service/find-by-id/find-by-id.service';
import { CreateFilmReqDto, CreateFilmResDto } from '../dto/create.dto';
import { Auth } from '../../auth/decorator/auth.decorator';
import { Role } from '../../common/enum/role.enum';
import { UpdateFilmService } from '../service/update/update.service';
import { UpdateFilmReqDto } from '../dto/update.dto';
import { DeleteFilmService } from '../service/soft-delete/soft-delete.service';
import { DeleteFilmReqDto } from '../dto/delete.dto';
import { ApiResponse } from '@nestjs/swagger';
import { FilmDto } from '../../common/dto/film.dto';
import { ApiResponseOk } from '../../common/decorator/ok-response.decorator';
import { EmptyResponse } from '../../common/dto/empty.dto';

@Controller('film')
export class FilmController {
  constructor(
    private readonly findAllService: FindAllFilmsService,
    private readonly findOneService: FindOneFilmService,
    private readonly createService: CreateFilmService,
    private readonly updateService: UpdateFilmService,
    private readonly deleteService: DeleteFilmService,
  ) {}

  @ApiResponseOk({
    options: {
      description: 'Returns all the films with partial pagination options',
    },
    type: FindAllResDto,
    extraModels: [FilmDto],
    addAuth: false,
  })
  @Get('all')
  findAll(@Query() params: FindAllReqDto): Promise<FindAllResDto> {
    return this.findAllService.execute(params);
  }

  @ApiResponseOk({
    options: {
      description: 'Return single film with provided filmId',
    },
    type: FilmDto,
  })
  @ApiResponse({
    description: 'Returns not found if incorrect filmId provided',
    status: 404,
  })
  @Get('one')
  @Auth([Role.user])
  findOne(@Query() params: FindOneReqDto): Promise<FilmDto> {
    return this.findOneService.execute(params);
  }

  @ApiResponseOk({
    options: {
      description: 'Return filmId if creation succeed',
    },
    type: CreateFilmResDto,
  })
  @ApiResponse({
    description: 'Returns bad request exception if record already exists',
    status: 400,
  })
  @Post()
  @Auth([Role.admin])
  create(@Body() req: CreateFilmReqDto): Promise<CreateFilmResDto> {
    return this.createService.execute(req);
  }

  @ApiResponseOk({
    options: {
      description: 'Returns status 200 if update succeed',
    },
    type: EmptyResponse,
  })
  @ApiResponse({
    description:
      'Returns bad request exception if record already exists or update failed',
    status: 400,
  })
  @Put()
  @Auth([Role.admin])
  async update(@Body() req: UpdateFilmReqDto): Promise<void> {
    await this.updateService.execute(req);
  }

  @ApiResponseOk({
    options: {
      description: 'Returns status 200 if deletion succeed',
    },
    type: EmptyResponse,
  })
  @ApiResponse({
    description: 'Returns bad request exception if record deletion failed',
    status: 400,
  })
  @Delete()
  @Auth([Role.admin])
  async delete(@Query() req: DeleteFilmReqDto): Promise<void> {
    await this.deleteService.execute(req);
  }
}
