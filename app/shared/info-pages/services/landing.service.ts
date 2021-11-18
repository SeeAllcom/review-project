import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export enum LandingFormType {
  mainCafe = 'main_cafe',
  user = 'user',
}

@Injectable({providedIn: 'root'})
export class LandingService {
  constructor(
    private http: HttpClient,
  ) {
  }

  sendMail(formValue: any) {
    return this.http.post('/api/landing/send-form-data-mail', formValue);
  }
}
