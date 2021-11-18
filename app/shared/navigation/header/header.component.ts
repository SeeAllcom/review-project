import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthComponent } from '../../components/login/auth.component';
import { AuthTabsTypeEnum } from '../../components/login/state/auth-header.model';
import { AuthHeaderService } from '../../components/login/state/auth-header.service';
import { UserLoginQuery } from '../../../states/user-login/user-login.query';
import { CityDialogComponent } from '../../components/city-dialog/city-dialog.component';
import { CitiesService } from '../../services/cities.service';
import { RootUrlService } from '../../services/root-url.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { WINDOW } from '../../helpers/window-ref';
import { LanguageService } from '../../services/language.service';
import { LANGUAGES } from '../../helpers/translate.helper';
import { FLAGS_SPRITE } from '../../helpers/variables.helper';
import { LanguageDialogComponent } from '../../components/language-dialog/language-dialog.component';
import { getLocalizationCityKey } from '../../translates/cities-translate.helper';
import { UserHistoryComponent } from '../../components/dialogs/user-history/user-history.component';
import { RealtimeUpdatesService } from '../../websockets/realtime-updates.service';
import { LocalStorage } from '../../storages/interfaces/local-storage.interface';

@UntilDestroy()
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  flagIconName: string = '';
  currentCity$ = this.citiesService.currentCity$;
  languages = LANGUAGES;
  readonly authTabsTypeEnum = AuthTabsTypeEnum;
  isUserLogin$ = this.userLoginQuery.isUserLoggedIn$;
  flagsSpriteName = FLAGS_SPRITE;
  historyUpdated$ = this.realtimeUpdatesService.historyUpdated$;

  constructor(
    private dialog: MatDialog,
    private userLoginQuery: UserLoginQuery,
    private authHeaderService: AuthHeaderService,
    private citiesService: CitiesService,
    private cdr: ChangeDetectorRef,
    private rootUrlService: RootUrlService,
    private languageService: LanguageService,
    private realtimeUpdatesService: RealtimeUpdatesService,
    private customLocalStorage: LocalStorage,
    @Inject(WINDOW) private window: Window,
    @Inject(PLATFORM_ID) private platformId: any,
  ) {
  }

  ngOnInit(): void {
    this.languageService.currentLanguage$
      .pipe(untilDestroyed(this))
      .subscribe((language) => {
        this.flagIconName = this.languages[language].flagIconName;
      });
  }

  getCityName(name: string) {
    return getLocalizationCityKey(name);
  }

  openAuthDialog(tab: AuthTabsTypeEnum) {
    this.authHeaderService.changeTab(tab);
    this.dialog.open(AuthComponent);
  }

  openCitiesSelector() {
    this.dialog.open(CityDialogComponent);
  }

  openLocalizationDialog() {
    this.dialog.open(LanguageDialogComponent);
  }

  openUserHistory() {
    this.dialog.open(UserHistoryComponent);
  }
}
