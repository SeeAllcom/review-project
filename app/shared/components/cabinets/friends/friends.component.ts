import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddFriendDialogComponent } from '../../dialogs/add-friend-dialog/add-friend-dialog.component';
import { Router } from '@angular/router';
import { FriendsService } from './friends.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, take } from 'rxjs/operators';
import { FriendsPageResponseData, FriendsInterface, FriendsPageUserInterface } from './friends.helper';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';
import { getBackendMessage } from '../../../helpers/errors.helper';
import { environment } from '../../../../../environments/environment';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie';
import { UserInterface } from '../../../helpers/auth-user.helper';

enum FriendsState {
  MyFriends = 'myFriends',
  FriendsMyFriend = 'friendsMyFriend',
}

enum FriendsType {
  Friends = 'friends',
  Subscribers = 'subscribers',
}

const friendActionsOnboarding = 'friend-actions-onboarding';

@UntilDestroy()
@Component({
  selector: 'friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FriendsComponent implements OnInit, OnDestroy {
  @ViewChild('myFriends', {static: true}) readonly myFriends!: TemplateRef<FriendsComponent>;
  @ViewChild('friendsMyFriend', {static: true}) readonly friendsMyFriend!: TemplateRef<FriendsComponent>;
  activeState: FriendsState = FriendsState.MyFriends;
  activeFriendsType: FriendsType = FriendsType.Friends;
  readonly state = FriendsState;
  readonly friendsType = FriendsType;
  isShowActionsOnboarding: boolean = false;
  getFriendsDataSub = Subscription.EMPTY;
  onboardingSetTimeout: any;
  friendsData: FriendsInterface = null;
  friendsDataLoaded: boolean = false;
  API_URL = environment.API_URL;
  currentFriendId: number = null;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private cookie: CookieService,
    private notifier: NotifierService,
    private translate: TranslateService,
    private friendsService: FriendsService,
    @Inject(PLATFORM_ID) private platform: any,
  ) {
  }

  ngOnInit(): void {
    this.getFriends();
    this.showActionsOnboarding();
  }

  changeFriendsType(friendsType: FriendsType) {
    this.activeFriendsType = friendsType;
  }

  getPeoples() {
    return this.friendsData[this.activeFriendsType];
  }

  ngOnDestroy(): void {
    clearTimeout(this.onboardingSetTimeout);
  }

  getFriends(friendId?: number) {
    this.currentFriendId = friendId ? friendId : null;
    this.getFriendsDataSub = this.friendsService.getFriends(friendId)
      .pipe(take(1), untilDestroyed(this))
      .subscribe((response) => {
          this.friendsData = response;
          this.friendsDataLoaded = true;
          this.activeFriendsType = FriendsType.Friends;
          this.activeState = friendId ? FriendsState.FriendsMyFriend : FriendsState.MyFriends;
          if (!friendId) {
            this.friendsData.friends.forEach((friend) => friend.mutual = true);
          }
          if (isPlatformBrowser(this.platform)) {
            window.scrollTo({top: 0});
          }
        },
        (res) => {
          if (res.message !== 'Unauthenticated.') {
            this.notifier.notify('error', this.translate.instant(getBackendMessage(res.message)));
          }
        },
      );
  }

  openFriendDialog() {
    this.dialog.open(AddFriendDialogComponent, {data: this.isPossibleFriendId()}).afterClosed()
      .pipe(take(1), filter((isHaveChanges) => !!isHaveChanges), untilDestroyed(this))
      .subscribe((res) => typeof res === 'number' ? this.getFriends(res) : this.getFriends(this.currentFriendId));
  }

  sendGiftToFriend(email: string) {
    this.router.navigate(['/cabinet/establishments-abonements'], {queryParams: {email}}).then();
  }

  deleteFriend(friend: FriendsPageResponseData | FriendsPageUserInterface) {
    this.friendsService.deleteFriend(friend)
      .pipe(take(1), untilDestroyed(this))
      .subscribe(() => {
        if (this.activeState === FriendsState.MyFriends) {
          this.friendsData.friends_count--;
        }
        friend.mutual = false;
      });
  }

  addFriend(friend: FriendsPageResponseData | FriendsPageUserInterface) {
    this.friendsService.addFriend(friend)
      .pipe(take(1), untilDestroyed(this))
      .subscribe(() => {
        if (this.activeState === FriendsState.MyFriends) {
          this.friendsData.friends_count++;
        }
        friend.mutual = true;
      });
  }

  isPossibleFriendId() {
    const filteredFriends =
      this.friendsData.friends.filter((friend) => friend.friends_count > 0 && !friend.my_account);
    const randomFriend = this.randomInteger(0, filteredFriends.length - 1);
    return filteredFriends[randomFriend] ? filteredFriends[randomFriend].id : null;
  }

  makeRandomArr() {
    const half = 0.5;
    return Math.random() - half;
  }

  randomInteger(min: number, max: number) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  }

  showActionsOnboarding() {
    const numberTimesToShow = 3;
    if (!this.cookie.get(friendActionsOnboarding)) {
      this.cookie.put(friendActionsOnboarding, '0', {path: '/'});
    }
    if (+this.cookie.get(friendActionsOnboarding) < numberTimesToShow) {
      this.cookie.put(friendActionsOnboarding, (+this.cookie.get(friendActionsOnboarding) + 1).toString(), {path: '/'});
      const timeForShowingOnboarding = 1500;
      this.onboardingSetTimeout = setTimeout(() => this.isShowActionsOnboarding = true, timeForShowingOnboarding);
      this.onboardingSetTimeout = setTimeout(() => this.isShowActionsOnboarding = false, timeForShowingOnboarding * 2);
    }
  }
}
