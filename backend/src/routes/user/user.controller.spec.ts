import { Test } from '@nestjs/testing';

import { mockDocument } from '../../../test/utils';
import { Bin } from '../../schemas/bin.schema';
import { User } from '../../schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findBins: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get(UserController);
    userService = module.get(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('findOne', () => {
    it('should return the user', () => {
      expect(
        userController.findOne(
          mockDocument(User, { username: 'name', about: {}, oauth: {} }),
        ),
      ).toEqual({ username: 'name', about: {}, oauth: {} });
    });
  });

  describe('findUserBins', () => {
    it('should return an empty array if no bins', async () => {
      jest.spyOn(userService, 'findBins').mockResolvedValueOnce([]);

      await expect(
        userController.findUserBins(mockDocument(User, {})),
      ).resolves.toEqual([]);
    });

    it('should returns bins if user has bins', async () => {
      jest
        .spyOn(userService, 'findBins')
        .mockResolvedValueOnce([
          mockDocument(Bin, { key: '123', files: [] }),
          mockDocument(Bin, { key: '456', files: [] }),
        ]);

      await expect(
        userController.findUserBins(mockDocument(User, {})),
      ).resolves.toEqual([
        { key: '123', files: [] },
        { key: '456', files: [] },
      ]);
    });
  });
});
