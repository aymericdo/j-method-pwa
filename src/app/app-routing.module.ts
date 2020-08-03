import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddClassesComponent } from './add-classes/add-classes.component';
import { ListClassesComponent } from './list-classes/list-classes.component';

const routes: Routes = [
  {
    path: 'home',
    component: ListClassesComponent,
  },
  {
    path: 'add-classes',
    component: AddClassesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
