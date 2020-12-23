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

import { binConfig } from '../../../configs';

export class FileDto {
  @IsString()
  @IsOptional()
  @MaxLength(binConfig.MAX_NAME_LENGTH)
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
  @MaxLength(binConfig.MAX_TITLE_LENGTH)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(binConfig.MAX_DESCRIPTION_LENGTH)
  description?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(binConfig.MAX_FILES)
  @ValidateNested()
  @Type(() => FileDto)
  files!: FileDto[];
}
