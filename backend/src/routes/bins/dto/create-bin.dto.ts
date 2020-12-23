import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import {
  MAX_DESCRIPTION_LENGTH,
  MAX_FILES,
  MAX_NAME_LENGTH,
  MAX_TITLE_LENGTH,
} from '../../../configs/bin.config';

export class FileDto {
  @IsString()
  @IsOptional()
  @MaxLength(MAX_NAME_LENGTH)
  name?: string;

  @IsString()
  content!: string;

  @IsInt()
  @IsOptional()
  @IsPositive()
  languageId?: number;
}

export class CreateBinDto {
  @IsString()
  @IsOptional()
  @MaxLength(MAX_TITLE_LENGTH)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(MAX_DESCRIPTION_LENGTH)
  description?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(MAX_FILES)
  @ValidateNested()
  @Type(() => FileDto)
  files!: FileDto[];
}
