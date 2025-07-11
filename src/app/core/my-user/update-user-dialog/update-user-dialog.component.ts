import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {LoggingService} from "../../logging.service";
import {IUpdateUser} from "../../../shared/models/user";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-update-user-dialog',
  templateUrl: './update-user-dialog.component.html',
  styleUrls: ['./update-user-dialog.component.scss']
})
export class UpdateUserDialogComponent implements OnInit {
  form!: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateUserDialogComponent>,
    private logService: LoggingService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public userData: IUpdateUser
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: [this.userData.firstName, Validators.required],
      lastName: [this.userData.lastName, Validators.required],
      dateOfBirth: [this.userData.dateOfBirth, Validators.required],
      email: [this.userData.email, [Validators.required, Validators.email]],
      description: [this.userData.description],
      socialMediaLink: [this.userData.socialMediaLink],
      phoneNumber: [this.userData.phoneNumber],
      address: [this.userData.address],
      city: [this.userData.city],
      country: [this.userData.country]
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.isSubmitting = true;
    this.errorMessage = null;

    const updatedUser: IUpdateUser = {
      ...this.userData,
      ...this.form.value
    };

    this.logService.updateUser(updatedUser).subscribe({
      next: () => {
        this.snackBar.open(`User information successfully updated`, '✖', {
          duration: 3000,
          panelClass: ['snackbar-success'],
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
        this.isSubmitting = false;
        this.dialogRef.close(updatedUser);
      },
      error: err => {
        this.snackBar.open('Failed to update user information', '✖', {
          duration: 3000,
          panelClass: ['snackbar-error'],
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
        this.isSubmitting = false;
        this.errorMessage = err?.error?.message || 'Failed to update user.';
      }
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
