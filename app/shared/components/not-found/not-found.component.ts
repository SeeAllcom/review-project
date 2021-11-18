import { Component, OnInit } from '@angular/core';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit {

  constructor(
    private title: Title,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.title.setTitle(
      this.translate.instant(marker('Упс... Схоже, що ви заблукали | CoffeePhone')),
    );
  }

}
