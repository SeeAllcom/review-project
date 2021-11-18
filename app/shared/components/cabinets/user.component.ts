import { Component, OnInit } from '@angular/core';
import { UserHistoryService } from '../dialogs/user-history/user-history.service';
import { RealtimeUpdatesService } from '../../websockets/realtime-updates.service';
import { filter, take } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {

  constructor(
    private userHistoryService: UserHistoryService,
    private realtimeUpdatesService: RealtimeUpdatesService,
  ) {
  }

  ngOnInit(): void {
    // TODO: розкоментувати коли будуть працювати сокети на історію
    // this.checkIfHistoryIsSeen();
  }

  private checkIfHistoryIsSeen(): void {
    this.userHistoryService.isFeedSeen()
      .pipe(
        take(1),
        filter((feedSeen: any) => !feedSeen.is_seen),
        untilDestroyed(this),
      ).subscribe(() => this.realtimeUpdatesService.historyUpdated$.next(true));
  }
}
