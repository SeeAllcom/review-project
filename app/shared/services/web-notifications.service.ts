import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';
import { catchError, take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Injectable({providedIn: 'root'})
export class WebNotificationsService {
  readonly VAPID_PUBLIC_KEY = 'BE8W6iR6bjntIFuIKS_jn8ObdSf655QEE4awGfcouY0_xXEpHKQS4LpIWce_yiErmDF6vVKYOFpyk_gabPCdCxY';
  isGrantedState$ = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private swPush: SwPush,
  ) {
  }

  subscribeToNotification() {
    this.swPush.requestSubscription({serverPublicKey: this.VAPID_PUBLIC_KEY})
      .then((sub) => {
        this.sendToServer(sub).pipe(take(1), untilDestroyed(this)).subscribe();
      }).catch((err) => catchError(err));
    if (Notification) {
      Notification.requestPermission().then((permission) => {
        this.isGrantedState$.next(permission === 'granted');
      });
    }
  }

  sendToServer(params: any) {
    return this.http.post('http://localhost:5000/notifications/presents', {notification: params});
  }
}
