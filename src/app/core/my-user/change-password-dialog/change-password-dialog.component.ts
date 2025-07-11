import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {LoggingService} from "../../logging.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss']
})
export class ChangePasswordDialogComponent {
  form: FormGroup;
  errorMessage: string | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    private logService: LoggingService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public username: string
  ) {
    this.form = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword1: ['', [Validators.required, Validators.minLength(6)]],
      newPassword2: ['', Validators.required],
    }, {
      validators: this.passwordMatchValidator // custom validator to check if new passwords match
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword1 = form.get('newPassword1')?.value;
    const newPassword2 = form.get('newPassword2')?.value;
    if (newPassword1 !== newPassword2) {
      form.get('newPassword2')?.setErrors({ mismatch: true });

      this.snackBar.open('Passwords do not match', '✖', {
        duration: 3000,
        panelClass: ['snackbar-error'],
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
    } else {
      return null;
    }
  }

  submit(): void {
    if (this.form.invalid) return;

    this.isSubmitting = true;
    this.errorMessage = null;

    const { oldPassword, newPassword1, newPassword2 } = this.form.value;

    this.logService.changePassword({
      username: localStorage.getItem('currentUsername'),
      oldPassword,
      newPassword1,
      newPassword2
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.dialogRef.close(true);
        this.snackBar.open(`Password changed successfully`, '✖', {
          duration: 3000,
          panelClass: ['snackbar-success'],
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      },
      error: err => {
        this.isSubmitting = false;
        this.errorMessage = err?.error?.message || 'Failed to change password';//Incorrect current password
      }
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
