import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketComponent } from './basket.component';
import {BasketRoutingModule} from "./basket-routing.module";
import {MatDialogModule} from "@angular/material/dialog";
import { CheckoutDialogComponent } from './checkout-dialog/checkout-dialog.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    BasketComponent,
    CheckoutDialogComponent
  ],
  imports: [
    CommonModule,
    BasketRoutingModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BasketModule { }
