import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MediumsRoutingModule } from './mediums-routing.module';
import { MediumsComponent } from './mediums.component';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatTooltipModule} from "@angular/material/tooltip";


@NgModule({
  declarations: [
    MediumsComponent
  ],
    imports: [
        CommonModule,
        MediumsRoutingModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        ReactiveFormsModule,
        FormsModule,
        MatTooltipModule
    ]
})
export class MediumsModule { }
