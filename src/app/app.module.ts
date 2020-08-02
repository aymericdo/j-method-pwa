import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AddClassesComponent } from './add-classes/add-classes.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListClassesComponent } from './list-classes/list-classes.component';

@NgModule({
  declarations: [
    AppComponent,
    AddClassesComponent,
    ListClassesComponent
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
    FormsModule,
    MatFormFieldModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
