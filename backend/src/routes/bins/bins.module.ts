import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CodeModule } from '../../libs/code';
import { Bin, BinSchema } from '../../schemas/bin.schema';
import { BinsController } from './bins.controller';
import { BinsService } from './bins.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bin.name, schema: BinSchema }]),
    CodeModule,
  ],
  controllers: [BinsController],
  providers: [BinsService],
})
export class BinsModule {}
