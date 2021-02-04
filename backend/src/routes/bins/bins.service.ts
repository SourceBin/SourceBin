import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import cryptoRandomString from 'crypto-random-string';
import { Model } from 'mongoose';
import { RedisService } from 'nestjs-redis';

import {
  CDN_CACHE_CONTROL,
  HIT_COUNT_WINDOW,
  KEY_LENGTH,
} from '../../configs/bin.config';
import { CodeService } from '../../libs/code';
import { GCloudStorageService } from '../../libs/gcloud-storage';
import { Bin, BinDocument } from '../../schemas/bin.schema';
import { User } from '../../schemas/user.schema';
import { CreateBinDto, FileDto } from './dto/create-bin.dto';

@Injectable()
export class BinsService {
  constructor(
    @InjectModel(Bin.name) private readonly binModel: Model<BinDocument>,
    private readonly codeService: CodeService,
    private readonly redisService: RedisService,
    private readonly gcloudStorage: GCloudStorageService,
  ) {}

  private generateKey(): Promise<string> {
    return cryptoRandomString.async({
      length: KEY_LENGTH,
      type: 'alphanumeric',
    });
  }

  async countHit(bin: Bin, id: string): Promise<void> {
    const key = `hit:${bin.key}:${id}`;

    const exists = await this.redisService.getClient().exists(key);
    if (exists) {
      return;
    }

    await this.redisService.getClient().set(key, 0, 'PX', HIT_COUNT_WINDOW);

    bin.hits += 1;
    this.binModel.updateOne({ key: bin.key }, { $inc: { hits: 1 } }).exec();
  }

  async classifyFiles(files: FileDto[]): Promise<void> {
    try {
      const languages = await this.codeService
        .detectLanguages(files.map((file) => file.content))
        .toPromise();

      for (let i = 0; i < files.length; i++) {
        files[i].languageId = languages[i];
      }
    } catch {
      throw new InternalServerErrorException('Failed to classify languages');
    }
  }

  findOne(key: string): Promise<BinDocument | null> {
    return this.binModel.findOne({ key }).exec();
  }

  async createBin(
    createBinDto: CreateBinDto,
    user?: User,
  ): Promise<BinDocument> {
    const bin = await this.binModel.create({
      key: await this.generateKey(),
      title: createBinDto.title,
      description: createBinDto.description,
      owner: user,
      files: createBinDto.files.map((file) => ({
        name: file.name,
        languageId: file.languageId,
      })),
    } as any);

    await Promise.all([
      createBinDto.files
        .map((file) => file.content)
        .map((content, i) =>
          this.gcloudStorage.saveFile(`bins/${bin.key}/${i}`, content, {
            contentType: 'text/plain',
            cacheControl: CDN_CACHE_CONTROL,
          }),
        ),
    ]);

    return bin;
  }

  async disownBin(key: string, user: User): Promise<boolean> {
    const result = await this.binModel
      .updateOne(
        {
          key,
          owner: user,
        },
        { $unset: { owner: true } },
      )
      .exec();

    return !!result.n;
  }
}
