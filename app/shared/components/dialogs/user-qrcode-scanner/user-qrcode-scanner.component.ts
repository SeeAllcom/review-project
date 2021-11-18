import { Component, OnInit } from '@angular/core';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { getBackendMessage } from '../../../helpers/errors.helper';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'user-qrcode-scanner',
  templateUrl: './user-qrcode-scanner.component.html',
  styleUrls: ['./user-qrcode-scanner.component.scss'],
})
export class UserQrcodeScannerComponent implements OnInit {
  error: string = '';
  result: string = '';
  isScanSuccess: boolean = false;
  isScanLoaded: boolean = false;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private dialogRef: MatDialogRef<UserQrcodeScannerComponent>,
  ) { }

  ngOnInit(): void {
  }

  camerasNotFoundHandler(event: any) {
    if (event.toString().includes('Requested device not found')) {
      this.error = this.translate.instant(marker('Дозвольте доступ до камери на вашому пристрої.'));
    } else {
      this.error = getBackendMessage(event.toString());
    }
  }

  scanSuccessHandler(event: any) {
    if (event.includes('?fromEstablishment=true')) {
      this.result = event;
    } else {
      this.error = marker('QR-код не валідний, відскануйте інший');
    }
  }

  scanErrorHandler(event: any) {
    this.error = getBackendMessage(event);
  }

  scanFailureHandler(event: any) {
    this.isScanLoaded = true;
  }

  scanCompleteHandler(event: any) {
    this.isScanLoaded = true;
    this.isScanSuccess = !!event;
    if (this.result && event && event.text.includes('?fromEstablishment=true')) {
      const from = event.text.search('/establishment/');
      const to = event.text.length;
      const establishmentUrl = event.text.substring(from, to).replace('?fromEstablishment=true', '');
      this.router.navigate([establishmentUrl], {queryParams: {fromEstablishment: true}}).then(() => {
        this.dialogRef.close();
      });
    }
  }
}
