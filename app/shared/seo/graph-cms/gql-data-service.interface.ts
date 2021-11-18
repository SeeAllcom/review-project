import { Observable } from 'rxjs';

export interface GqlDataService {
  load(variables: object): Observable<any>;
  getInfo(...manyArgs: any[]): Observable<any>;
}
