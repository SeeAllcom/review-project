import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

export enum NotificationType {
  Primary = 'primary',
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
  Bonuses = 'bonuses',
}

@Component({
  selector: 'notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  @Input() title: string = '';
  @Input() isEmitter: boolean = false;
  @Input() isCanClose: boolean = false;
  @Input() isShown: boolean = true;
  @Input() btnTitle: string = marker('Зрозуміло');
  @Output() clickEmit = new EventEmitter<void>();
  @Input() NotificationType: NotificationType = NotificationType.Primary;

  constructor() { }

  ngOnInit(): void {
  }

  confirmEmit() {
    this.clickEmit.emit();
  }

  closeNotification() {
    this.isShown = false;
  }
}
