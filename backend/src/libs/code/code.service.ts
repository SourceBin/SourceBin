import { HttpService, Injectable } from '@nestjs/common';
import { languages } from '@sourcebin/linguist';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CodeService {
  constructor(private readonly httpService: HttpService) {}

  detectLanguages(contents: string[]): Observable<number[]> {
    return this.httpService
      .post<string[]>(
        `http://${process.env.GENUS_CODICE_URL}/classify`,
        contents,
      )
      .pipe(map((res) => res.data.map((l) => languages[l])));
  }
}
