import {Component, Injectable, OnInit, Output} from '@angular/core';
import {NgForm} from "@angular/forms";
import {HttpClient, HttpInterceptor} from "@angular/common/http";
import {UserLogin} from "../../shared/models/userLogin";
import {Cart} from "../../shared/models/cart";
import {MatDialog} from "@angular/material/dialog";
import { MatDialogRef } from "@angular/material/dialog";
import {LoggingService} from "../logging.service";
import { Router } from "@angular/router";
import { IUser } from "../../shared/models/user";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
@Injectable()
export class LoginDialogComponent implements OnInit {

  invalidLogin: boolean;
  errorMessage = '';

  userjson = '';

  public user : UserLogin = new UserLogin()

  constructor(
    private httpClient: HttpClient,
    private logService: LoggingService,
    private dialogRef: MatDialogRef<LoginDialogComponent>,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  login(form: NgForm) {
    if (form.invalid) return;

    this.user.username = form.value.username;
    this.user.password = form.value.password;

    this.logService.login(this.user).subscribe({
      next: ({ user, token }) => {
        this.invalidLogin = false;
        this.errorMessage = '';
        this.dialogRef.close();
        this.router.navigateByUrl('/shop');
        location.reload();
        // this.snackBar.open(`Login successful`, '✖', {
        //   duration: 3000,
        //   panelClass: ['snackbar-success'],
        //   horizontalPosition: 'end',
        //   verticalPosition: 'bottom'
        // });
      },
      error: (err) => {
        this.invalidLogin = true;
        if(err.error.includes('banned')) this.errorMessage = 'User has been banned!';
        else this.errorMessage = 'Invalid username or password';
        this.snackBar.open('Login failed', '✖', {
          duration: 3000,
          panelClass: ['snackbar-error'],
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
        console.error('Login error', err);
      }
    });
  }
}
