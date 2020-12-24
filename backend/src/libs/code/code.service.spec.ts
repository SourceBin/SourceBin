import { HttpService } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { of } from 'rxjs';

import { CodeService } from './code.service';

jest.mock('@sourcebin/linguist', () => ({
  languages: { one: 1, two: 2 },
}));

describe('CodeService', () => {
  let codeService: CodeService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CodeService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
      ],
    }).compile();

    codeService = module.get(CodeService);
    httpService = module.get(HttpService);
  });

  it('should be defined', () => {
    expect(codeService).toBeDefined();
  });

  describe('detectLanguages', () => {
    it('returns empty array if called with empty array', (done) => {
      codeService.detectLanguages([]).subscribe((res) => {
        expect(res).toEqual([]);
        expect(httpService.post).not.toBeCalled();
        done();
      });
    });

    it('returns languages if provided with array', (done) => {
      jest.spyOn(httpService, 'post').mockReturnValueOnce(
        of({
          data: ['one', 'two'],
        } as any),
      );

      codeService.detectLanguages(['content']).subscribe((res) => {
        expect(res).toEqual([1, 2]);
        expect(httpService.post).toBeCalledTimes(1);
        done();
      });
    });
  });
});
