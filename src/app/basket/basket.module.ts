import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketComponent } from './basket.component';
import {BasketRoutingModule} from "./basket-routing.module";
import {MatDialogModule} from "@angular/material/dialog";
import { CheckoutDialogComponent } from './checkout-dialog/checkout-dialog.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import { MatFormFieldModule } from '@angular/material/form-field';


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
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule
  ]
})
export class BasketModule { }
