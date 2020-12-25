import { createMock } from '@golevelup/nestjs-testing';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Model, Query } from 'mongoose';

import { mockDocument } from '../../../test/utils';
import { Bin, BinDocument } from '../../schemas/bin.schema';
import { OAuth, User, UserDocument } from '../../schemas/user.schema';
import { UserService } from './user.service';

type UserQuery = Query<UserDocument, UserDocument>;
type BinQuery<ResultType = BinDocument> = Query<ResultType, BinDocument>;

describe('UserService', () => {
  let userService: UserService;
  let userModel: Model<UserDocument>;
  let binModel: Model<BinDocument>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
          },
        },
        {
          provide: getModelToken(Bin.name),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get(UserService);
    userModel = module.get(getModelToken(User.name));
    binModel = module.get(getModelToken(Bin.name));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findOne', () => {
    it('should return user if it exists', async () => {
      jest.spyOn(userModel, 'findOne').mockReturnValueOnce(
        createMock<UserQuery>({
          exec: jest
            .fn()
            .mockResolvedValueOnce(mockDocument(User, { _id: 'user id' })),
        }),
      );

      await expect(userService.findOne('user id')).resolves.toEqual(
        mockDocument(User, { _id: 'user id' }),
      );
    });

    it('should return null if user does not exist', async () => {
      jest.spyOn(userModel, 'findOne').mockReturnValueOnce(
        createMock<UserQuery>({
          exec: jest.fn().mockResolvedValueOnce(null),
        }),
      );

      await expect(userService.findOne('user id')).resolves.toBeNull();
    });
  });

  describe('getOrCreate', () => {
    it('should return user if it exists', async () => {
      jest
        .spyOn(userModel, 'findOneAndUpdate')
        .mockResolvedValueOnce(mockDocument(User, { _id: 'user id' }));

      await expect(
        userService.getOrCreate(mockDocument(OAuth, {}), {
          about: { avatarURL: '' },
        }),
      ).resolves.toEqual(mockDocument(User, { _id: 'user id' }));
    });

    it('should create a new user if it does not exist', async () => {
      jest
        .spyOn(userModel, 'create')
        .mockImplementation((data) => Promise.resolve(data));

      jest.spyOn(userModel, 'findOneAndUpdate').mockResolvedValueOnce(null);

      await expect(
        userService.getOrCreate(mockDocument(OAuth, {}), {
          about: { avatarURL: 'avatar url' },
        }),
      ).resolves.toEqual({ about: { avatarURL: 'avatar url' } });
    });
  });

  describe('findBins', () => {
    it('should return user bins', async () => {
      jest.spyOn(binModel, 'find').mockReturnValueOnce(
        createMock<BinQuery<BinDocument[]>>({
          select: () => ({
            exec: jest
              .fn()
              .mockResolvedValueOnce([
                mockDocument(Bin, { key: '123' }),
                mockDocument(Bin, { key: '456' }),
              ]),
          }),
        }),
      );

      await expect(
        userService.findBins(mockDocument(User, {})),
      ).resolves.toEqual([
        mockDocument(Bin, { key: '123' }),
        mockDocument(Bin, { key: '456' }),
      ]);
    });
  });
});
