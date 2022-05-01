import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { SettingService } from '../setting.service';
import { AppState } from '../store';
import { ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import { ConfirmationDeletionDialogComponent } from '../list-classes/confirmation-deletion-dialog/confirmation-deletion-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  submitting = false;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private settingService: SettingService,
    private router: Router,
    private dialog: MatDialog,
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  openDialog(dialog: 'blop'): void {
    if (dialog === 'blop') {
      const daySchedulerDialogRef = this.dialog.open(ConfirmationDeletionDialogComponent, {
        data: {
          title: 'Je suis vraiment au tel avec toi en ce moment ?',
        },
      });

      daySchedulerDialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.settingService.fixCourses().subscribe(() => {});
        }
      });
    }
  }
}
