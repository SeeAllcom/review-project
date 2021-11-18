import { Injectable } from '@angular/core';
import {
  NetworkAbonementRequestBody,
  NetworkAbonementResponse,
} from '../../components/owner-establishment/helpers/network-abonements.helper';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class NetworkAbonementsService {
  constructor(
    private http: HttpClient,
  ) {
  }

  getAbonements(): Observable<NetworkAbonementResponse[]> {
    return this.http.get<NetworkAbonementResponse[]>('/api/network/product-abonements');
  }

  addAbonement(abonement: NetworkAbonementRequestBody) {
    return this.http.post<NetworkAbonementRequestBody>('/api/network/product-abonements/store', abonement);
  }

  editAbonement(abonement: NetworkAbonementRequestBody, id: number) {
    return this.http.put<NetworkAbonementRequestBody>(`/api/network/product-abonements/${id}/update`, abonement);
  }

  deleteAbonement(id: number) {
    return this.http.delete<NetworkAbonementResponse>(`/api/network/product-abonements/${id}/destroy`);
  }
}
