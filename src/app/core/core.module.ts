import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NavBarComponent} from "./nav-bar/nav-bar.component";
import { RouterModule} from "@angular/router";
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { MatDialogModule} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { RegisterDialogComponent } from './register-dialog/register-dialog.component';
import { MyUserComponent } from './my-user/my-user.component';
import { ChangePasswordDialogComponent } from './my-user/change-password-dialog/change-password-dialog.component';
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import { UpdateUserDialogComponent } from './my-user/update-user-dialog/update-user-dialog.component';
import { CreateArtistDialogComponent } from './my-user/create-artist-dialog/create-artist-dialog.component';



@NgModule({
  declarations: [NavBarComponent, LoginDialogComponent, RegisterDialogComponent, MyUserComponent, ChangePasswordDialogComponent, UpdateUserDialogComponent, CreateArtistDialogComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    FormsModule,

    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,

    RouterModule.forChild([
      { path: '', component: MyUserComponent }
    ])
  ],
  exports: [NavBarComponent,LoginDialogComponent],
  providers: [
    LoginDialogComponent
  ]
})
export class CoreModule { }
