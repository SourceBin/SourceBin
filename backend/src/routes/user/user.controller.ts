import { Controller, Get, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../../decorators/current-user.decorator';
import { RateLimit } from '../../libs/rate-limiter';
import { User } from '../../schemas/user.schema';
import { seconds } from '../../utils/time.util';
import { RequiredAuthGuard } from '../auth/guards/required.guard';
import { BinResponseDto } from '../bins/dto/bin-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(RequiredAuthGuard)
  @RateLimit({ every: seconds(1) })
  findOne(@CurrentUser() user: User): UserResponseDto {
    return UserResponseDto.fromDocument(user);
  }

  @Get('bins')
  @UseGuards(RequiredAuthGuard)
  @RateLimit({ every: seconds(10) })
  async findUserBins(@CurrentUser() user: User): Promise<BinResponseDto[]> {
    const bins = await this.userService.findBins(user);

    return bins.map(BinResponseDto.fromDocument);
  }
}
