import { Bin } from '../../../schemas/bin.schema';
import { BaseResponseDto } from '../../../utils/base-response.dto';

export class BinCreatedResponseDto extends BaseResponseDto<BinCreatedResponseDto> {
  readonly key!: string;
  readonly languages!: number[];

  static fromDocument(bin: Bin): BinCreatedResponseDto {
    return new BinCreatedResponseDto({
      key: bin.key,
      languages: bin.files.map((file) => file.languageId),
    });
  }
}
