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
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AddClassesComponent } from './add-classes/add-classes.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfirmationSignoutDialogComponent, DaySchedulerDialogComponent, ListClassesComponent } from './list-classes/list-classes.component';
import { HoursSelectorComponent } from './list-classes/hours-selector/hours-selector.dialog';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { InfiniteScrollComponent } from './shared/infinite-scroll/infinite-scroll.component';
import { ScrollableDirective } from './shared/scroll-to/scrollable.directive';
import { OffsetTopDirective } from './shared/scroll-to/offset-top.directive';

@NgModule({
  declarations: [
    AppComponent,
    AddClassesComponent,
    ListClassesComponent,
    ConfirmationSignoutDialogComponent,
    DaySchedulerDialogComponent,
    HoursSelectorComponent,
    InfiniteScrollComponent,
    ScrollableDirective,
    OffsetTopDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatBottomSheetModule,
    FormsModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatMenuModule,
    HttpClientModule,
  ],
  entryComponents: [
    ConfirmationSignoutDialogComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
