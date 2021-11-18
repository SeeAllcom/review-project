import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AbonementsService } from '../../../services/abonements.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { take } from 'rxjs/operators';
import { EstablishmentWithAbonementsData } from '../../../helpers/abonements.helper';
import { environment } from '../../../../../environments/environment';
import { Subscription } from 'rxjs';
import { getBackendMessage } from '../../../helpers/errors.helper';
import { CityDialogComponent } from '../../city-dialog/city-dialog.component';
import { CitiesService } from '../../../services/cities.service';
import { MatDialog } from '@angular/material/dialog';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';

@UntilDestroy()
@Component({
  selector: 'establishments-abonements',
  templateUrl: './establishments-abonements.component.html',
  styleUrls: ['./establishments-abonements.component.scss'],
})
export class EstablishmentsAbonementsComponent implements OnInit {
  establishments: EstablishmentWithAbonementsData[] = [];
  friendEmail = this.activatedRoute.snapshot.queryParams.email;
  API_URL = environment.API_URL;
  getEstablishmentsSub = Subscription.EMPTY;
  error: string = '';
  isCurrentCity$ = this.citiesService.currentCity$;

  constructor(
    private citiesService: CitiesService,
    private dialog: MatDialog,
    private router: Router,
    private notifier: NotifierService,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private abonementsService: AbonementsService,
    ) { }

  ngOnInit(): void {
    this.getEstablishmentsWithAbonements();
    if (this.friendEmail) {
      this.notifier.notify('success',
        this.translate.instant(marker('Виберіть заклад, щоб подарувати абонемент(и) другу')));
    }
  }

  openEstablishmentAbonements(slug: string) {
    this.router.navigate(['/cabinet/' + slug + '/season-tickets'], {queryParams: {email: this.friendEmail}}).then();
  }

  getEstablishmentsWithAbonements() {
    this.getEstablishmentsSub = this.abonementsService.getEstablishmentsWithAbonements()
      .pipe(take(1), untilDestroyed(this))
      .subscribe((establishments) => {
        this.establishments = establishments.networks;
      },
        (res) => { this.error = getBackendMessage(res.message); },
      );
  }

  goBack() {
    this.location.back();
  }

  openCitiesSelector() {
    this.dialog.open(CityDialogComponent);
  }
}
