import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MediumsComponent } from './mediums.component';

const routes: Routes = [{ path: '', component: MediumsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MediumsRoutingModule { }
