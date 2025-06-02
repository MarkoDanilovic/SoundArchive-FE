import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PaginationModule} from "ngx-bootstrap/pagination";
import { PagingHeaderComponent } from './components/paging-header/paging-header.component';
import { PagerComponent } from './components/pager/pager.component';
import {FormsModule} from "@angular/forms";
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import { TableComponent } from './components/table/table.component';
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";



@NgModule({
  declarations: [
    PagingHeaderComponent,
    PagerComponent,
    ConfirmationDialogComponent,
    TableComponent
  ],
  imports: [
    CommonModule,
    PaginationModule.forRoot(),
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule
  ],
  exports: [
    PaginationModule,
    PagingHeaderComponent,
    PagerComponent,
    TableComponent
  ]
})
export class SharedModule { }
