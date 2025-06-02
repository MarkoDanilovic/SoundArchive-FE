import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {LoggingService} from "../logging.service";
import {IUpdateUser, IUser} from "../../shared/models/user";
import {ChangePasswordDialogComponent} from "./change-password-dialog/change-password-dialog.component";
import {UpdateUserDialogComponent} from "./update-user-dialog/update-user-dialog.component";
import {CreateArtistDialogComponent} from "./create-artist-dialog/create-artist-dialog.component";
import {IArtist} from "../../shared/models/artist";
import {Router} from "@angular/router";

@Component({
  selector: 'app-my-user',
  templateUrl: './my-user.component.html',
  styleUrls: ['./my-user.component.scss']
})
export class MyUserComponent implements OnInit {

  userData?: IUser;

  constructor(private matDialog:MatDialog, private logService: LoggingService, private router: Router) { }

  ngOnInit(): void {
    this.logService.getCurrentUser().subscribe({
      next: (user: IUser) => {
        this.userData = user;
      },
      error: err => {
        console.error('Failed to fetch user data', err);
      }
    });
  }

  updateUser() {
    if (!this.userData) return;

    const dialogRef = this.matDialog.open(UpdateUserDialogComponent, {
      data: {
        ...this.userData
      }
    });

    dialogRef.afterClosed().subscribe((result: IUpdateUser | null) => {
      if (result) {
        this.userData.firstName = result.firstName
        this.userData.lastName = result.lastName
        this.userData.dateOfBirth = result.dateOfBirth
        this.userData.email = result.email
        this.userData.description = result.description
        this.userData.socialMediaLink = result.socialMediaLink
        this.userData.phoneNumber = result.phoneNumber
        this.userData.address = result.address
        this.userData.city = result.city
        this.userData.country = result.country

        //this.logService.getCurrentUser();

        console.log('User updated successfully:', result);
      }
    });
  }

  changePassword() {
    const dialogRef = this.matDialog.open(ChangePasswordDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const {oldPassword, newPassword1, newPassword2} = result;

        const passwordChange = {
          username: this.userData?.username ?? '',
          oldPassword,
          newPassword1,
          newPassword2
        };

        this.logService.changePassword(passwordChange).subscribe({
          next: () => {
            console.log('Password changed successfully.');
          },
          error: err => {
            console.error('Failed to change password:', err);
          }
        });
      }
    });
  }

  // createArtist(): void {
  //   const dialogRef = this.matDialog.open(CreateArtistDialogComponent);
  //
  //   dialogRef.afterClosed().subscribe((newArtist: IArtist | null) => {
  //     if (newArtist) {
  //       console.log('Artist created successfully:', newArtist);
  //     }
  //   });
  // }

  createArtist(): void {

    const dialogRef = this.matDialog.open(CreateArtistDialogComponent);

    dialogRef.afterClosed().subscribe((newArtist: IArtist | null) => {
      if (newArtist) {
        console.log('Artist created successfully:', newArtist);

        this.router.navigateByUrl('/shop');
        location.reload();
      }
    });
  }

  isArtist() {

    console.log('THIS IS CALLED currentUserArtistId: ' + localStorage.getItem('currentUserArtistId'))
    return !!localStorage.getItem('currentUserArtistId');
  }

}
