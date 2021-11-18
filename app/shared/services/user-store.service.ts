import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ChangingPasswordInterface, IPData, UserInterface } from '../helpers/auth-user.helper';
import { catchError } from 'rxjs/operators';
import { APPLICATIONS_ROUTE } from '../components/owner-establishment/helpers/network.helper';
import { RequestMethodsEnum } from '../helpers/urls.helper';

export const StandaloneAppModulesBasePathsEnum = {
  CoffeePhoneUser: '/',
  AppURLS: Object.values(APPLICATIONS_ROUTE),
};

@Injectable({providedIn: 'root'})
export class UserStoreService {
  constructor(private http: HttpClient) {}

  getIPData(): Observable<IPData> {
    return this.http.get<IPData>('https://json.geoiplookup.io').pipe(
      catchError((error) => throwError(error)),
    );
  }

  getUser(): Observable<UserInterface> {
    return this.http.get<UserInterface>('/api/user').pipe(
      catchError((error) => throwError(error)),
    );
  }

  changePassword(form: ChangingPasswordInterface): Observable<ChangingPasswordInterface> {
    return this.http.put<ChangingPasswordInterface>('/api/user/update-password', form);
  }

  changeName(form: any): Observable<UserInterface> {
    return this.http.put<UserInterface>('/api/user/update-data', {name: form.name});
  }

  changeAvatar(avatar: any, name: string): Observable<UserInterface> {
    const formData = new FormData();
    const file: File = avatar._files[0];
    formData.append('avatar', file, file.name);
    formData.append('name', name);
    formData.append('_method', RequestMethodsEnum.Update);
    return this.http.post<UserInterface>('/api/user/update-data', formData);
  }
}
