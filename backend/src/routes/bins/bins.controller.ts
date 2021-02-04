import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Ip,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from '../../decorators/current-user.decorator';
import { RateLimit } from '../../libs/rate-limiter';
import { Plan, User } from '../../schemas/user.schema';
import { hours, minutes, seconds } from '../../utils/time.util';
import { RequiredAuthGuard } from '../auth/guards/required.guard';
import { BinsService } from './bins.service';
import { BinCreatedResponseDto } from './dto/bin-created-response.dto';
import { BinResponseDto } from './dto/bin-response.dto';
import { CreateBinDto } from './dto/create-bin.dto';

const KEY_PATTERN = '[0-9a-zA-Z]{10}';

@Controller('bins')
export class BinsController {
  constructor(private readonly binsService: BinsService) {}

  @Get(`:key(${KEY_PATTERN})`)
  @RateLimit({ every: seconds(10) })
  async findOne(
    @Param('key') key: string,
    @Ip() ip: string,
    @CurrentUser() user?: User,
  ): Promise<BinResponseDto> {
    const bin = await this.binsService.findOne(key);

    if (!bin) {
      throw new NotFoundException();
    }

    await this.binsService.countHit(bin, user?._id ?? ip);
    return BinResponseDto.fromDocument(bin);
  }

  @Post()
  @RateLimit({ window: hours(3), every: minutes(5) })
  async create(
    @Body() createBinDto: CreateBinDto,
    @CurrentUser() user?: User,
  ): Promise<BinCreatedResponseDto> {
    if (createBinDto.files.length > 1 && user?.plan !== Plan.PRO) {
      throw new ForbiddenException('Only Pro users can save multibins');
    }

    await this.binsService.classifyFiles(
      createBinDto.files.filter((file) => file.languageId === undefined),
    );

    const bin = await this.binsService.createBin(createBinDto, user);
    return BinCreatedResponseDto.fromDocument(bin);
  }

  @Delete(`:key(${KEY_PATTERN})`)
  @UseGuards(RequiredAuthGuard)
  @RateLimit({ every: seconds(10) })
  async disownOne(
    @Param('key') key: string,
    @CurrentUser() user: User,
  ): Promise<{ success: boolean }> {
    const success = await this.binsService.disownBin(key, user);

    if (!success) {
      throw new NotFoundException(
        'Bin does not exist or you are not the owner',
      );
    }

    return { success: true };
  }
}
