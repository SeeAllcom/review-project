import { Component, Input, OnInit } from '@angular/core';
import { UserSideNetworkInterface } from '../../../helpers/networks.helper';
import { EstablishmentLocationsDialogComponent } from '../../cabinets/my-abonements/establishment-locations-dialog/establishment-locations-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'network-info',
  templateUrl: './network-info.component.html',
  styleUrls: ['./network-info.component.scss'],
})
export class NetworkInfoComponent implements OnInit {
  @Input() network: UserSideNetworkInterface;
  @Input() networkLoaded: boolean = false;
  @Input() isMobile: boolean = false;

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  openLocation() {
    this.dialog.open(EstablishmentLocationsDialogComponent, {data: this.network});
  }
}
