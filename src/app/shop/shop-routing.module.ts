import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {ShopComponent} from "./shop.component";
import {TrackDetailsComponent} from "./track-details/track-details.component";

const routes: Routes = [
  {path: '', component:ShopComponent},
  {path: ':id', component: TrackDetailsComponent}
]


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ShopRoutingModule { }
