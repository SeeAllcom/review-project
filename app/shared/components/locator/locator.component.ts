import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { take } from 'rxjs/operators';
import { UserStoreService } from '../../services/user-store.service';

@Component({
  selector: 'locator',
  templateUrl: './locator.component.html',
  styleUrls: ['./locator.component.scss'],
})
export class LocatorComponent implements OnInit {
  lang = 'ru';
  address = ['вул. Єлизавети Чавдар, 8', 'вулиця Єлизавети Чавдар, 36'];
  establishment = '';
  city: string = '';
  constructor(
    private domSanitizer: DomSanitizer,
    private userStoreService: UserStoreService,
    ) { }

  ngOnInit(): void {
    this.getIP();
  }

  getIP() {
    this.userStoreService.getIPData().pipe(take(1)).subscribe(
      (IPDetails) => this.city = IPDetails.city,
      (error) => error,
    );
  }

  getMapsUrl() {
    // tslint:disable-next-line:max-line-length
    return this.domSanitizer.bypassSecurityTrustResourceUrl(`https://maps.google.com/maps?&hl=${this.lang}&q=${this.address}+()&ie=UTF8&iwloc=B&output=embed&z=14`);
  }
}
