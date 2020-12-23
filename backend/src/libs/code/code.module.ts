import { HttpModule, Module } from '@nestjs/common';

import { CodeService } from './code.service';

@Module({
  imports: [HttpModule],
  providers: [CodeService],
  exports: [CodeService],
})
export class CodeModule {}
