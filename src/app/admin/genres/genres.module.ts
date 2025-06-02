import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GenresRoutingModule } from './genres-routing.module';
import { GenresComponent } from './genres.component';
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    GenresComponent
  ],
  imports: [
    CommonModule,
    GenresRoutingModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    FormsModule
  ]
})
export class GenresModule { }
