import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class RealtimeUpdatesService {
  historyUpdated$ = new BehaviorSubject<boolean>(false);

  constructor() {
  }
}
