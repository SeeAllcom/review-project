import { Component, Input, OnInit } from '@angular/core';
import { NetworkBonuses, UserSideNetworkInterface } from '../../../helpers/networks.helper';

@Component({
  selector: 'bonuses',
  templateUrl: './bonuses.component.html',
  styleUrls: ['./bonuses.component.scss'],
})
export class BonusesComponent implements OnInit {
  @Input() loaded: boolean = false;
  @Input() isLoggedIn: boolean = false;
  @Input() isMobile: boolean = false;
  @Input() network: UserSideNetworkInterface = null;

  constructor() { }

  ngOnInit(): void {
  }

}
