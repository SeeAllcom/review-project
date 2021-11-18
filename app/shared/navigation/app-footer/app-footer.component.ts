import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { UntilDestroy} from '@ngneat/until-destroy';

interface PaymentsInterface {
  name: string;
  imgSrc: string;
  link: string;
}

const payments: PaymentsInterface[] = [
  {
    name: 'google pay',
    imgSrc: '/assets/img/payments/google-pay.png',
    link: 'https://pay.google.com/intl/uk_ua/about/',
  },
  {
    name: 'apple pay',
    imgSrc: '/assets/img/payments/apple-pay.png',
    link: 'https://www.apple.com/ru/apple-pay/',
  },
  {
    name: 'masterpas',
    imgSrc: '/assets/img/payments/masterpas.png',
    link: 'https://masterpass.com/uk-ua.html',
  },
  {
    name: 'visa',
    imgSrc: '/assets/img/payments/visa.png',
    link: 'https://www.visa.com.ua/uk_UA',
  },
  {
    name: 'ibox',
    imgSrc: '/assets/img/payments/ibox.svg',
    link: 'https://ibox.ua/',
  },
  {
    name: 'prostir',
    imgSrc: '/assets/img/payments/prostir.png',
    link: 'https://prostir.gov.ua/prostir/',
  },
];

@UntilDestroy()
@Component({
  selector: 'app-footer',
  templateUrl: './app-footer.component.html',
  styleUrls: ['./app-footer.component.scss'],
})
export class AppFooterComponent implements OnInit {
  payments: PaymentsInterface[] = payments;
  currentYear = new Date().getFullYear();
  isFooterVisible: boolean = false;

  constructor(
  ) {
  }

  ngOnInit(): void {
  }

  toggleFooterVisibility() {
    this.isFooterVisible = !this.isFooterVisible;
  }
}
