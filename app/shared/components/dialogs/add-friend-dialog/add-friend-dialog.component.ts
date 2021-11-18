import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FriendsPageResponseData, FriendsMyFriend, SearchUsers } from '../../cabinets/friends/friends.helper';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../../../../environments/environment';
import { FriendsService } from '../../cabinets/friends/friends.service';
import { take } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Subscription } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'add-friend-dialog',
  templateUrl: './add-friend-dialog.component.html',
  styleUrls: ['./add-friend-dialog.component.scss'],
})
export class AddFriendDialogComponent implements OnInit {
  searchFriends: SearchUsers = null;
  searchForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
  });
  API_URL = environment.API_URL;
  isHaveChanges: boolean = false;
  searchSub = Subscription.EMPTY;
  addOrDeleteFriendSub = Subscription.EMPTY;
  randomIdFoundedFriend: number = 0;
  currentFriendId: number = null;
  possibleFriends: FriendsPageResponseData[] | FriendsMyFriend[] = [];

  constructor(
    private notifier: NotifierService,
    private translate: TranslateService,
    private friendsService: FriendsService,
    private dialogRef: MatDialogRef<AddFriendDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public possibleFriendId: number,
  ) {
  }

  ngOnInit(): void {
    if (this.possibleFriendId !== null) {
      this.getFriends(this.possibleFriendId);
    }
  }

  goToFriend(friendId: number): void {
    this.dialogRef.close(friendId);
  }

  deleteFriend(friend: FriendsPageResponseData) {
    this.currentFriendId = friend.id;
    this.addOrDeleteFriendSub = this.friendsService.deleteFriend(friend)
      .pipe(take(1), untilDestroyed(this))
      .subscribe(() => {
        friend.mutual = false;
        this.isHaveChanges = true;
      });
  }

  addFriend(friend: FriendsPageResponseData) {
    this.currentFriendId = friend.id;
    this.addOrDeleteFriendSub = this.friendsService.addFriend(friend)
      .pipe(take(1), untilDestroyed(this))
      .subscribe(() => {
        friend.mutual = true;
        this.isHaveChanges = true;
      });
  }

  searchFriend() {
    if (this.searchForm.valid) {
      this.searchSub = this.friendsService.searchFriend(this.searchForm.controls.email.value)
        .pipe(take(1), untilDestroyed(this))
        .subscribe((res) => {
          this.searchFriends = res;
          const randomIdFoundedFriend = res.users[this.randomInteger(0, res.users_count - 1)].id;
          this.getFriends(randomIdFoundedFriend);
        });
    }
  }

  randomInteger(min: number, max: number) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  }

  getFriends(randomId: number) {
    this.friendsService.getFriends(randomId)
      .pipe(take(1), untilDestroyed(this))
      .subscribe((res) => {
        this.possibleFriends = res.friends.reduce(
          (acc, friend) => (!acc.find((el) => el.id === friend.id) ? [...acc, friend] : acc),
          this.possibleFriends).filter((friend) => !friend.mutual && !friend.my_account);
      });
  }

  closeDialog() {
    this.dialogRef.close(this.isHaveChanges);
  }
}
