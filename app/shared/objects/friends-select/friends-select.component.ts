import { Component, Input, OnInit } from '@angular/core';
import { FriendsPageResponseData } from '../../components/cabinets/friends/friends.helper';
import { environment } from '../../../../environments/environment';
import { FormControl } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field/form-field';

@Component({
  selector: 'friends-select',
  templateUrl: './friends-select.component.html',
  styleUrls: ['./friends-select.component.scss'],
})
export class FriendsSelectComponent implements OnInit {
  API_URL = environment.API_URL;
  searchFriendValue: string = '';
  @Input() friendEmailForGift: FormControl;
  @Input() friendsData: FriendsPageResponseData[] = [];
  @Input() shown: boolean = true;
  @Input() appearance: MatFormFieldAppearance = 'standard';

  constructor() { }

  ngOnInit(): void {
  }

  filteredFriends() {
    return !this.searchFriendValue ? this.friendsData : this.friendsData.filter((el: any) =>
      el.name.toLowerCase().includes(this.searchFriendValue.toLowerCase()));
  }
}
