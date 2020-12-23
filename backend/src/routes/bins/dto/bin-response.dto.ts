import { Bin, File } from '../../../schemas/bin.schema';
import { BaseResponseDto } from '../../../utils/base-response.dto';

export class FileResponseDto extends BaseResponseDto<FileResponseDto> {
  readonly name?: string;
  readonly languageId!: number;

  static fromDocument(file: File): FileResponseDto {
    return new FileResponseDto({
      name: file.name,
      languageId: file.languageId,
    });
  }
}

export class BinResponseDto extends BaseResponseDto<BinResponseDto> {
  readonly key!: string;
  readonly title?: string;
  readonly description?: string;
  readonly hits!: number;
  readonly created!: Date;
  readonly files!: FileResponseDto[];

  static fromDocument(bin: Bin): BinResponseDto {
    return new BinResponseDto({
      key: bin.key,
      title: bin.title,
      description: bin.description,
      hits: bin.hits,
      created: bin.created,
      files: bin.files.map(FileResponseDto.fromDocument),
    });
  }
}
