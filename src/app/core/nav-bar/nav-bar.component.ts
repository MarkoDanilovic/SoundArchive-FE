import {Component, Input, OnInit} from '@angular/core';
import {BasketService} from "../../basket/basket.service";
import {CheckoutDialogComponent} from "../../basket/checkout-dialog/checkout-dialog.component";
import {LoginDialogComponent} from "../login-dialog/login-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {LoggingService} from "../logging.service";
import {RegisterDialogComponent} from "../register-dialog/register-dialog.component";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {


  totalItems = 0;

  logRole = Number(localStorage.getItem('currentUserRole'))

  logArtist = !!localStorage.getItem('currentUserArtistId');

  username: string | null = null;

  private cartSubscription!: Subscription;

  constructor(private cartService: BasketService, private matDialog:MatDialog, private logService: LoggingService) {



  }

  ngOnInit(): void {

    this.cartService.loadCart().subscribe();

    this.cartSubscription = this.cartService.cart$.subscribe(cart => {
      if (cart) {
        this.totalItems = cart.items?.length || 0;
        console.log("Updated totalItems:", this.totalItems);
      }
    });
  }

  openLoginDialog(username?: string) {
    this.matDialog.closeAll()
    const dialogRef = this.matDialog.open(LoginDialogComponent)
    this.logRole = Number(localStorage.getItem('currentUserRole'))

    if (username) {
      dialogRef.componentInstance.user.username = username;
    }
  }

  openRegisterDialog() {
    this.matDialog.closeAll()
    const registerDialogRef = this.matDialog.open(RegisterDialogComponent)//.id

    registerDialogRef.componentInstance.registrationSuccess.subscribe((username: string) => {
      console.log('Received username from registration:', username);
      this.openLoginDialog(username);
    });
  }

  logout() {
    this.logService.logout();
    this.logRole = 0;
    //location.reload()
  }

  updateLogArtist() {

    this.logArtist = !!localStorage.getItem('currentUserArtistId');
  }
}
