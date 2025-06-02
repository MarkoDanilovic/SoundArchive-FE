import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop.component';
import {SharedModule} from "../shared/shared.module";
import { TrackItemComponent } from './track-item/track-item.component';
import { TrackDetailsComponent } from './track-details/track-details.component';
import {RouterModule} from "@angular/router";
import {ShopRoutingModule} from "./shop-routing.module";




@NgModule({
  declarations: [
    ShopComponent,
    TrackItemComponent,
    TrackDetailsComponent,

  ],
    exports: [
        TrackItemComponent

    ],
  imports: [
    CommonModule,
    SharedModule,
    ShopRoutingModule
  ]
})
export class ShopModule { }
