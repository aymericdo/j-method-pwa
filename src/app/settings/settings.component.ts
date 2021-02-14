import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { SettingService } from '../setting.service';
import { AppState } from '../store';
import { setLoadingSetting, setSettings } from '../store/current-session.actions';
import { selectSettings } from '../store/current-session.reducer';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import { ConfirmationDeletionDialogComponent } from '../list-classes/confirmation-deletion-dialog/confirmation-deletion-dialog.component';
import { Course } from '../list-classes/list-classes.component';
import { MatDialog } from '@angular/material/dialog';

export interface Settings {
  maxCoursesNumber: number;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  maxCoursesNumber = null;
  selectedSettings$: Observable<Settings>;
  submitting = false;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private settingService: SettingService,
    private router: Router,
    private dialog: MatDialog,
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
    this.settingService.getSettings()
      .subscribe(({ settings, isLoadingSetting }) => {
        this.store.dispatch(setLoadingSetting({ loadingSetting: isLoadingSetting }));
        this.store.dispatch(setSettings({ settings }));
      });

    this.store.pipe(
      select(selectSettings),
      takeUntil(this.destroyed$),
    ).subscribe((settings: Settings) => {
        this.maxCoursesNumber = settings.maxCoursesNumber;
      })
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  openDialog(dialog: 'resetWE'): void {
    if (dialog === 'resetWE') {
      const daySchedulerDialogRef = this.dialog.open(ConfirmationDeletionDialogComponent, {
        data: {
          title: 'Voulez-vous vraiment réinitialiser les révisions du weekend ?',
        },
      });

      daySchedulerDialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.handleResetWeekend();
        }
      });
    }
  }


  handleResetWeekend(): void {
    this.submitting = true;
    this.settingService.deleteWeekEndRevisions()
      .subscribe(() => {
        this.submitting = false;
        this.store.dispatch(setLoadingSetting({ loadingSetting: true }));
        this.router.navigate(['/home']);
      });
  }

  saveSettings(): void {
    this.submitting = true;
    this.settingService.postSettings({ maxCoursesNumber: this.maxCoursesNumber })
      .subscribe((settings) => {
        this.submitting = false;
        this.store.dispatch(setSettings({ settings }));
        this.store.dispatch(setLoadingSetting({ loadingSetting: true }));
        this.router.navigate(['/home']);
      });
  }
}
