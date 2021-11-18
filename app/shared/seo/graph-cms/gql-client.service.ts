import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { publishReplay, refCount, map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

interface GraphCmsError {
  message: string;
}

interface GqlResponse<T> {
  data: T;
  errors?: GraphCmsError[];
}

type GraphQLDataCache<RequestVariables> = {
  [key in string]: {
    data: Observable<GqlResponse<any>>;
    query: string;
    variables: RequestVariables;
  }
};

const graphCmsDirectUrl = environment.graphCMSUrl;

@Injectable({
  providedIn: 'root',
})
export class GqlClientService<RequestVariables = object> {
  private readonly graphcmsUrl = graphCmsDirectUrl;
  dataCache: GraphQLDataCache<RequestVariables> = {};
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platform: any,
  ) {}

  load<ResponseDataType>(
    operationName: string,
    query: string,
    variables: RequestVariables,
  ) {
    const params = {
      operationName,
      variables: JSON.stringify(variables),
      query,
    };
    if (isPlatformBrowser(this.platform)) {
      if (
        !this.dataCache[operationName] ||
        !this.validateCacheRelevance(operationName, variables, query)
      ) {
        this.dataCache = {
          ...this.dataCache,
          [operationName]: {
            data: this.http
              .get<GqlResponse<ResponseDataType>>(this.graphcmsUrl, {
                params,
              })
              .pipe(
                publishReplay(1),
                refCount(),
                map((response) => this.handleError(response)),
              ),
            variables,
            query,
          },
        };
      }
      return this.dataCache[operationName].data;
    } else {
      return this.http
      .get<GqlResponse<ResponseDataType>>(this.graphcmsUrl, {
        params,
      })
      .pipe(
        map((response) => this.handleError(response)),
      );
    }
  }

  private validateCacheRelevance(operationName: string, variables: RequestVariables, query: string) {
    const cacheVarsKeys = this.dataCache[operationName] ? Object.keys(this.dataCache[operationName].variables) : [];
    const newVarsKeys = Object.keys(variables);
    return (
      query === this.dataCache[operationName].query &&
      cacheVarsKeys.length === newVarsKeys.length &&
      cacheVarsKeys.every(
        (entry) =>
          variables[entry] &&
          this.dataCache[operationName].variables[entry] === variables[entry],
      )
    );
  }

  private handleError<ResponseDataType>(
    response: GqlResponse<ResponseDataType>,
  ) {
    if (response.errors) {
      throw new Error('GraphCmsError! log:' + JSON.stringify(response.errors));
    } else {
      return response;
    }
  }
}
