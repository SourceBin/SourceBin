import { createMock } from '@golevelup/nestjs-testing';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Redis } from 'ioredis';
import { Model, Query } from 'mongoose';
import { RedisService } from 'nestjs-redis';

import { mockDocument } from '../../../test/utils';
import { GCloudStorageService } from '../../libs/gcloud-storage';
import { Bin, BinDocument } from '../../schemas/bin.schema';
import { User } from '../../schemas/user.schema';
import { BinsService } from './bins.service';

type BinQuery = Query<BinDocument, BinDocument>;

describe('BinsService', () => {
  let binsService: BinsService;
  let binModel: Model<BinDocument>;
  let redisService: RedisService;
  let gcloudStorage: GCloudStorageService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        BinsService,
        {
          provide: getModelToken(Bin.name),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            updateOne: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            getClient: jest.fn(),
          },
        },
        {
          provide: GCloudStorageService,
          useValue: {
            saveFile: jest.fn(),
          },
        },
      ],
    }).compile();

    binsService = module.get(BinsService);
    binModel = module.get(getModelToken(Bin.name));
    redisService = module.get(RedisService);
    gcloudStorage = module.get(GCloudStorageService);
  });

  it('should be defined', () => {
    expect(binsService).toBeDefined();
  });

  describe('generateKey', () => {
    it('should generate a valid key', async () => {
      await expect(binsService['generateKey']()).resolves.toMatch(
        /[a-z0-9]{10}/i,
      );
    });
  });

  describe('countHit', () => {
    it('should count a hit if id does not exist', async () => {
      jest.spyOn(binModel, 'updateOne').mockReturnValue(
        createMock<BinQuery>({
          exec: jest.fn(),
        }),
      );

      jest.spyOn(redisService, 'getClient').mockReturnValue(
        createMock<Redis>({
          exists: jest.fn().mockResolvedValueOnce(false),
          set: jest.fn(),
        }),
      );

      const binMock = mockDocument(Bin, { hits: 0 });
      await binsService.countHit(binMock, 'id');

      expect(binMock.hits).toBe(1);
      expect(redisService.getClient().set).toBeCalledTimes(1);
      expect(binModel.updateOne().exec).toBeCalledTimes(1);
    });

    it('should not count a hit if id already exists', async () => {
      jest.spyOn(redisService, 'getClient').mockReturnValue(
        createMock<Redis>({
          exists: jest.fn().mockResolvedValueOnce(true),
        }),
      );

      const binMock = mockDocument(Bin, { hits: 0 });
      await binsService.countHit(binMock, 'id');

      expect(binMock.hits).toBe(0);
      expect(binModel.updateOne).not.toBeCalled();
    });
  });

  describe('findOne', () => {
    it('should return bin if it exists', async () => {
      jest.spyOn(binModel, 'findOne').mockReturnValueOnce(
        createMock<BinQuery>({
          exec: jest
            .fn()
            .mockResolvedValueOnce(mockDocument(Bin, { key: '123' })),
        }),
      );

      await expect(binsService.findOne('123')).resolves.toEqual(
        mockDocument(Bin, { key: '123' }),
      );
    });

    it('should return null if bin does not exist', async () => {
      jest.spyOn(binModel, 'findOne').mockReturnValueOnce(
        createMock<BinQuery>({
          exec: jest.fn().mockResolvedValueOnce(null),
        }),
      );

      await expect(binsService.findOne('123')).resolves.toBeNull();
    });
  });

  describe('createBin', () => {
    it('should save a bin with a single file', async () => {
      jest.spyOn(binModel, 'create').mockResolvedValueOnce(
        mockDocument(Bin, {
          key: '123',
          files: [{ languageId: 1 }],
        }) as never,
      );

      const createdBin = await binsService.createBin({
        files: [{ content: 'one', languageId: 1 }],
      });

      expect(createdBin).toEqual(
        mockDocument(Bin, { key: '123', files: [{ languageId: 1 }] }),
      );

      expect(gcloudStorage.saveFile).toBeCalledTimes(1);
      expect(gcloudStorage.saveFile).toHaveBeenCalledWith(
        'bins/123/0',
        'one',
        expect.anything(),
      );
    });

    it('should save a bin with multiple files', async () => {
      jest.spyOn(binModel, 'create').mockResolvedValueOnce(
        mockDocument(Bin, {
          key: '123',
          files: [{ languageId: 1 }, { languageId: 2 }],
        }) as never,
      );

      const createdBin = await binsService.createBin({
        files: [
          { content: 'one', languageId: 1 },
          { content: 'two', languageId: 2 },
        ],
      });

      expect(createdBin).toEqual(
        mockDocument(Bin, {
          key: '123',
          files: [{ languageId: 1 }, { languageId: 2 }],
        }),
      );

      expect(gcloudStorage.saveFile).toHaveBeenCalledTimes(2);
      expect(gcloudStorage.saveFile).toHaveBeenNthCalledWith(
        1,
        'bins/123/0',
        'one',
        expect.anything(),
      );
      expect(gcloudStorage.saveFile).toHaveBeenNthCalledWith(
        2,
        'bins/123/1',
        'two',
        expect.anything(),
      );
    });
  });

  describe('disownBin', () => {
    it('should return true if it disowned a bin', async () => {
      jest.spyOn(binModel, 'updateOne').mockReturnValueOnce(
        createMock<BinQuery>({
          exec: jest.fn().mockResolvedValueOnce({ n: 1 }),
        }),
      );

      await expect(
        binsService.disownBin('123', mockDocument(User, {})),
      ).resolves.toBe(true);
    });

    it('should return false if it did not disown a bin', async () => {
      jest.spyOn(binModel, 'updateOne').mockReturnValueOnce(
        createMock<BinQuery>({
          exec: jest.fn().mockResolvedValueOnce({ n: 0 }),
        }),
      );

      await expect(
        binsService.disownBin('123', mockDocument(User, {})),
      ).resolves.toBe(false);
    });
  });
});
