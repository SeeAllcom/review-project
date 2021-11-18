import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { WebNotificationsService } from '../../services/web-notifications.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'confirm-web-push-notification',
  templateUrl: './confirm-web-push-notification.component.html',
  styleUrls: ['./confirm-web-push-notification.component.scss'],
})
export class ConfirmWebPushNotificationComponent implements OnInit {
  isEnabled = this.swPush.isEnabled;
  isGrantedState$ = this.webNotificationsService.isGrantedState$;
  isGranted: boolean = false;
  isIos = this.deviceDetectorService.os === 'iOS';
  @Input() title: string = '';
  requestPermissionLoaded: boolean = false;

  constructor(
    private swPush: SwPush,
    private webNotificationsService: WebNotificationsService,
    private deviceDetectorService: DeviceDetectorService,
    @Inject(PLATFORM_ID) private platform: any,
  ) { }

  ngOnInit(): void {
    this.getGranted();
  }

  confirmWebNotification() {
    this.webNotificationsService.subscribeToNotification();
  }

  getGranted(): any {
    if (Notification) {
      Notification.requestPermission().then((permission) => {
        this.requestPermissionLoaded = true;
        this.isGranted = permission === 'granted';
      });
    }
  }
}
