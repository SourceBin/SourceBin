import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { mockDocument } from '../../../test/utils';
import { Bin } from '../../schemas/bin.schema';
import { Plan, User } from '../../schemas/user.schema';
import { BinsController } from './bins.controller';
import { BinsService } from './bins.service';
import { BinCreatedResponseDto } from './dto/bin-created-response.dto';
import { BinResponseDto } from './dto/bin-response.dto';
import { CreateBinDto } from './dto/create-bin.dto';

describe('BinsController', () => {
  let binsController: BinsController;
  let binsService: BinsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [BinsController],
      providers: [
        {
          provide: BinsService,
          useValue: {
            generateKey: jest.fn().mockResolvedValue('123'),
            countHit: jest.fn(),
            classifyFiles: jest.fn(),
            findOne: jest
              .fn()
              .mockImplementation((key: string) =>
                Promise.resolve(mockDocument(Bin, { key, files: [] })),
              ),
            createBin: jest.fn().mockImplementation((dto: CreateBinDto) =>
              mockDocument(Bin, {
                key: '123',
                files: dto.files.map((file, i) => ({
                  languageId: file.languageId ?? i,
                })),
              }),
            ),
            disownBin: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    binsController = module.get(BinsController);
    binsService = module.get(BinsService);
  });

  it('should be defined', () => {
    expect(binsController).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a bin if it exists', async () => {
      await expect(
        binsController.findOne('123', '', undefined),
      ).resolves.toEqual(
        BinResponseDto.fromDocument(
          mockDocument(Bin, { key: '123', files: [] }),
        ),
      );

      await expect(
        binsController.findOne('456', '', undefined),
      ).resolves.toEqual(
        BinResponseDto.fromDocument(
          mockDocument(Bin, { key: '456', files: [] }),
        ),
      );
    });

    it('should count a hit if not logged in', async () => {
      await binsController.findOne('123', 'ip', undefined);

      expect(binsService.countHit).toHaveBeenCalledWith(
        expect.anything(),
        'ip',
      );
    });

    it('should count a hit if logged in', async () => {
      await binsController.findOne(
        '123',
        'ip',
        mockDocument(User, { _id: 'user id' }),
      );

      expect(binsService.countHit).toHaveBeenCalledWith(
        expect.anything(),
        'user id',
      );
    });

    it('should throw not found if no bin exists', async () => {
      jest.spyOn(binsService, 'findOne').mockResolvedValueOnce(null);

      await expect(
        binsController.findOne('123', '', undefined),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a bin if languages are provided', async () => {
      jest.spyOn(binsService, 'classifyFiles').mockResolvedValueOnce();

      await expect(
        binsController.create({
          files: [{ content: 'one', languageId: 42 }],
        }),
      ).resolves.toEqual(
        BinCreatedResponseDto.fromDocument(
          mockDocument(Bin, { key: '123', files: [{ languageId: 42 }] }),
        ),
      );

      await expect(
        binsController.create(
          {
            files: [
              { content: 'one', languageId: 42 },
              { content: 'two', languageId: 24 },
            ],
          },
          mockDocument(User, { plan: Plan.PRO }),
        ),
      ).resolves.toEqual(
        BinCreatedResponseDto.fromDocument(
          mockDocument(Bin, {
            key: '123',
            files: [{ languageId: 42 }, { languageId: 24 }],
          }),
        ),
      );
    });

    it('should create a bin and detect languages if languages are not provided', async () => {
      jest
        .spyOn(binsService, 'classifyFiles')
        .mockImplementation((files) =>
          Promise.resolve(files.forEach((file, i) => (file.languageId = i))),
        );

      await expect(
        binsController.create({
          files: [{ content: 'one' }],
        }),
      ).resolves.toEqual(
        BinCreatedResponseDto.fromDocument(
          mockDocument(Bin, { key: '123', files: [{ languageId: 0 }] }),
        ),
      );

      await expect(
        binsController.create(
          {
            files: [{ content: 'one' }, { content: 'two' }],
          },
          mockDocument(User, { plan: Plan.PRO }),
        ),
      ).resolves.toEqual(
        BinCreatedResponseDto.fromDocument(
          mockDocument(Bin, {
            key: '123',
            files: [{ languageId: 0 }, { languageId: 1 }],
          }),
        ),
      );
    });

    it('should throw forbidden if multiple files are provided and user is not pro', async () => {
      await expect(
        binsController.create({
          files: [{ content: 'one' }, { content: 'two' }],
        }),
      ).rejects.toThrow(
        new ForbiddenException('Only Pro users can save multibins'),
      );
    });
  });

  describe('disownOne', () => {
    it('should return success if it disowned the bin', async () => {
      await expect(
        binsController.disownOne('123', mockDocument(User, {})),
      ).resolves.toEqual({ success: true });
    });

    it('should throw not found if disown failed', async () => {
      jest.spyOn(binsService, 'disownBin').mockResolvedValueOnce(false);

      await expect(
        binsController.disownOne('123', mockDocument(User, {})),
      ).rejects.toThrow(
        new NotFoundException('Bin does not exist or you are not the owner'),
      );
    });
  });
});
