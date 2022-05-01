import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AddClassesComponent } from './add-classes/add-classes.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListClassesComponent } from './list-classes/list-classes.component';
import { HoursSelectorDialogComponent } from './list-classes/hours-selector-dialog/hours-selector-dialog.component';
import { RushDialogComponent } from './list-classes/rush-dialog/rush-dialog.component';
import { WeekendDialogComponent } from './list-classes/weekend-dialog/weekend-dialog.component';
import { ConfirmationSignoutDialogComponent } from './list-classes/confirmation-signout-dialog/confirmation-signout-dialog.component';
import { DaySchedulerDialogComponent } from './list-classes/day-scheduler-dialog/day-scheduler-dialog.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { InfiniteScrollComponent } from './shared/infinite-scroll/infinite-scroll.component';
import { SpeedDialFabComponent } from './shared/speed-dial-fab/speed-dial-fab.component';
import { ScrollableDirective } from './shared/scroll-to/scrollable.directive';
import { OffsetTopDirective } from './shared/scroll-to/offset-top.directive';
import { TokenInterceptor } from './token-interceptor';
import { APP_DATE_FORMATS, MyDateAdapter } from './my-date-adapter';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DailyScheduleComponent } from './daily-schedule/daily-schedule.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { metaReducers, reducers } from './store';
import { TodayClassesComponent } from './today-classes/today-classes.component';
import { DescriptionClassComponent } from './description-class/description-class.component';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { SettingsComponent } from './settings/settings.component';
import { LoginComponent } from './login/login.component';
import { ConfirmationDeletionDialogComponent } from './list-classes/confirmation-deletion-dialog/confirmation-deletion-dialog.component';

@NgModule({
  declarations: [
    AddClassesComponent,
    AppComponent,
    ConfirmationSignoutDialogComponent,
    DailyScheduleComponent,
    DaySchedulerDialogComponent,
    ConfirmationDeletionDialogComponent,
    DescriptionClassComponent,
    HoursSelectorDialogComponent,
    InfiniteScrollComponent,
    ListClassesComponent,
    LoginComponent,
    OffsetTopDirective,
    RushDialogComponent,
    WeekendDialogComponent,
    ScrollableDirective,
    SettingsComponent,
    SpeedDialFabComponent,
    TodayClassesComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    MatBadgeModule,
    FormsModule,
    HttpClientModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
  ],
  entryComponents: [
    ConfirmationSignoutDialogComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    { provide: DateAdapter, useClass: MyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
