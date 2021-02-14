import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddClassesComponent } from './add-classes/add-classes.component';
import { AuthGuardService as AuthGuard } from './auth-guard.service';
import { ListClassesComponent } from './list-classes/list-classes.component';
import { DailyScheduleComponent } from './daily-schedule/daily-schedule.component';
import { TodayClassesComponent } from './today-classes/today-classes.component';
import { DescriptionClassComponent } from './description-class/description-class.component';
import { SettingsComponent } from './settings/settings.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: ListClassesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-classes',
    component: AddClassesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'today-classes',
    component: TodayClassesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'daily-schedule',
    component: DailyScheduleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'detail-class/:id',
    component: DescriptionClassComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
