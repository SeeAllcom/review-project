import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { AbonementStatus, AbonementsTemplates, NetworkAbonementResponse } from '../helpers/network-abonements.helper';
import { ActionsAbonementComponent } from './actions-abonement/actions-abonement.component';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';
import { NetworkAbonementsService } from '../../../services/owner/network-abonements.service';
import { filter, take } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { getBackendMessage } from '../../../helpers/errors.helper';
import { trimLongText } from 'src/app/shared/helpers/helpers';
import {
  ConfirmDeleteDialogComponent,
  ConfirmDeleteInterface,
} from '../dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

@UntilDestroy()
@Component({
  selector: 'abonements',
  templateUrl: './abonements.component.html',
  styleUrls: ['./abonements.component.scss'],
})
export class AbonementsComponent implements OnInit {
  @ViewChild('abonementsTemplate', {static: true}) readonly abonementsTemplate!: TemplateRef<AbonementsComponent>;
  @ViewChild('empty', {static: true}) readonly empty!: TemplateRef<AbonementsComponent>;
  @ViewChild('loading', {static: true}) readonly loading!: TemplateRef<AbonementsComponent>;
  @ViewChild('errorTemplate', {static: true}) readonly errorTemplate!: TemplateRef<AbonementsComponent>;
  currentTemplate: AbonementsTemplates = AbonementsTemplates.loading;
  readonly template = AbonementsTemplates;
  readonly AbonementStatus = AbonementStatus;
  API_URL = environment.API_URL;
  todayTimestamp = new Date().getTime();
  error: string = '';
  abonements: NetworkAbonementResponse[] = [];

  constructor(
    private dialog: MatDialog,
    private notifier: NotifierService,
    private translate: TranslateService,
    private networkAbonementsService: NetworkAbonementsService,
  ) {
  }

  ngOnInit(): void {
    this.getAbonements();
  }

  trimLongText(txt: string) {
    const maxWordsForDescr = 60;
    return trimLongText(txt, maxWordsForDescr, false);
  }

  getAbonementStatus(abonement: NetworkAbonementResponse) {
    switch (true) {
      case this.abonementDidNotStart(abonement):
        return AbonementStatus.DidNotStart;
      case this.abonementStarted(abonement):
        return AbonementStatus.Started;
      case this.abonementIsOver(abonement):
        return AbonementStatus.IsOver;
      default: return false;
    }
  }

  private abonementDidNotStart(abonement: NetworkAbonementResponse) {
    return this.convertDateToTimestamp(abonement.date_start) > this.todayTimestamp
    && this.convertDateToTimestamp(abonement.date_end) > this.todayTimestamp;
  }

  private abonementStarted(abonement: NetworkAbonementResponse) {
    return this.convertDateToTimestamp(abonement.date_start) < this.todayTimestamp
    && this.convertDateToTimestamp(abonement.date_end) > this.todayTimestamp;
  }

  private abonementIsOver(abonement: NetworkAbonementResponse) {
    return this.convertDateToTimestamp(abonement.date_end) < this.todayTimestamp
      && this.convertDateToTimestamp(abonement.date_end) < this.todayTimestamp;
  }

  convertDateToTimestamp(date: string) {
    return Date.parse(date);
  }

  getAbonements() {
    this.networkAbonementsService.getAbonements()
      .pipe(take(1), untilDestroyed(this))
      .subscribe((abonements) => {
          if (!abonements.length) {
            this.currentTemplate = this.template.empty;
          } else {
            this.currentTemplate = this.template.abonementsTemplate;
            this.abonements = abonements;
          }
        }, (res) => {
          this.currentTemplate = this.template.errorTemplate;
          this.error = getBackendMessage(res.message);
          this.notifier.notify('error', this.translate.instant(this.error));
        },
      );
  }

  openDeleteAbonementDialog(abonement: NetworkAbonementResponse) {
    const confirmDataConfig = {
      element: abonement,
      deleteFunc: () => this.networkAbonementsService.deleteAbonement(abonement.id),
    } as ConfirmDeleteInterface;
    if (!this.abonementIsOver(abonement)) {
      confirmDataConfig.notification =
        marker('Абонемент ще не закінчився, користувачі які його придбали зможуть ним користуватся.');
    }
    this.dialog.open(ConfirmDeleteDialogComponent, {data: confirmDataConfig}).afterClosed()
      .pipe(filter((isDeleted) => !!isDeleted), take(1), untilDestroyed(this))
      .subscribe(() => {
        this.abonements = this.abonements.filter((el) => el.id !== abonement.id);
        const abonementName = `${abonement.quantity} ${abonement.product.name} `;
        this.notifier.notify('success', abonementName + this.translate.instant(marker('успішно видалений')));
      });
  }

  openAddAbonementsDialog() {
    this.dialog.open(ActionsAbonementComponent).afterClosed()
      .pipe(filter((needUpdate) => !!needUpdate), take(1), untilDestroyed(this))
      .subscribe(() => this.getAbonements());
  }

  openEditAbonementDialog(abonement: NetworkAbonementResponse) {
    this.dialog.open(ActionsAbonementComponent, {data: {abonement, status: this.getAbonementStatus(abonement)}})
      .afterClosed()
      .pipe(filter((needUpdate) => !!needUpdate), take(1), untilDestroyed(this))
      .subscribe(() => this.getAbonements());
  }
}
