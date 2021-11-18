import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthTabsTypeEnum } from './state/auth-header.model';
import { AuthHeaderQuery } from './state/auth-header.query';
import { AuthHeaderService } from './state/auth-header.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LocalStorage } from '../../storages/interfaces/local-storage.interface';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NotifierService } from 'angular-notifier';
import { exchangeCodeMessageError } from '../../helpers/errors.helper';
import { TranslateService } from '@ngx-translate/core';

export interface AuthComponentDataInterface {
  hideBackBtn: boolean;
}

@UntilDestroy()
@Component({
  selector: 'auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AuthComponent implements OnInit, OnDestroy {
  @ViewChild('signIn', {static: true}) readonly SignIn!: TemplateRef<AuthComponent>;
  @ViewChild('signUp', {static: true}) readonly SignUp!: TemplateRef<AuthComponent>;
  authTypeControl = new FormControl();
  readonly authTabsType = AuthTabsTypeEnum;
  authType$ = this.authHeaderQuery.authType$;
  activeFlow: AuthTabsTypeEnum = AuthTabsTypeEnum.Login;
  exchangeCodeMessageError = exchangeCodeMessageError;
  isSwipeDown: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private authHeaderQuery: AuthHeaderQuery,
    private authHeaderService: AuthHeaderService,
    private customLocalStorage: LocalStorage,
    private activatedRoute: ActivatedRoute,
    private notifierService: NotifierService,
    private dialog: MatDialogRef<AuthComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AuthComponentDataInterface,
  ) {
  }

  ngOnInit() {
    this.authType$
      .pipe(untilDestroyed(this))
      .subscribe((val) => this.authTypeControl.setValue(val));
  }

  ngOnDestroy() {
  }

  changeTab(tab: AuthTabsTypeEnum) {
    this.authHeaderService.changeTab(tab);
  }

  closeDialog() {
    this.dialog.close(false);
  }
}
