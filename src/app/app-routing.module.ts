import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddClassesComponent } from './add-classes/add-classes.component';
import { AuthGuardService as AuthGuard } from './auth-guard.service';
import { ListClassesComponent } from './list-classes/list-classes.component';
import { DailyScheduleComponent } from './daily-schedule/daily-schedule.component';

const routes: Routes = [
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
    path: 'daily-schedule',
    component: DailyScheduleComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
