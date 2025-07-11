import {Component, Input, OnInit} from '@angular/core';
import {BasketService} from "./basket.service";
import {HttpClient} from "@angular/common/http";
import {CartItem} from "../shared/models/cartitem";
import {MatDialog} from "@angular/material/dialog";
import {CheckoutDialogComponent} from "./checkout-dialog/checkout-dialog.component";
import {FormGroup} from "@angular/forms";
import {Cart} from "../shared/models/cart";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {

  cart : Cart | null = null;

  isReserved: boolean = false;

  displayedColumns: string[] = ['name', 'artist', 'medium', 'duration', 'quantity', 'price', 'actions'];

  @Input() form : FormGroup;
  constructor(protected cartService: BasketService,
              private httpClient:HttpClient,
              private matDialog: MatDialog,
              private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // this.cartService.loadCart().subscribe(cart => {
    //   this.cart = cart;
    //   console.log("BasketComponent. This is the id of the cart: " + cart.id)
    // });

    this.loadCart();
  }

  loadCart() {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      console.log("BasketComponent. This is the id of the cart: " + cart.id)
      console.log("Updated cart:", cart);

      this.isReserved = cart.status === 'reserved';
    });
  }

  addItem(item: CartItem): void {
    this.cartService.addToCart(item.trackId, item.mediumId).subscribe(updatedCart => {
      this.cart = updatedCart;
      this.snackBar.open(`Item added from cart`, '✖', {
        duration: 3000,
        panelClass: ['snackbar-success'],
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
    });
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.trackId, item.mediumId).subscribe(updatedCart => {
      this.cart = updatedCart;
      this.snackBar.open(`Item removed from cart`, '✖', {
        duration: 3000,
        panelClass: ['snackbar-success'],
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
    });
  }

  getCartItemCount() {
    return this.cartService.getCartItemCount();
  }

  // Method to toggle the cart status between reserved and new
  // toggleReserve(): void {
  //   if (!this.cart) return;
  //
  //   const newStatus = this.isReserved ? 'new' : 'reserved';
  //
  //   this.cartService.changeCartStatus(this.cart.id.toString(), newStatus).subscribe({
  //     next: () => {
  //       this.isReserved = !this.isReserved;  // Toggle the button state
  //       console.log(`Cart status changed to: ${newStatus}`);
  //     },
  //     error: (err) => console.error('Error changing cart status:', err)
  //   });
  // }

  // Reserve the cart (set status to "reserved")
  reserveCart(): void {
    if (!this.cart) return;

    if(!this.isLoggedIn()) {
      this.snackBar.open(`Login to reserve cart`, '✖', {
        duration: 3000,
        panelClass: ['snackbar-error'],
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
      return;
    }

    if (!this.isReserved) {
      this.cartService.changeCartStatus(this.cart.id.toString(), 'reserved').subscribe({
        next: () => {
          this.isReserved = true;
          console.log('Cart reserved');
          this.snackBar.open(`Order successfully reserved`, '✖', {
            duration: 3000,
            panelClass: ['snackbar-success'],
            horizontalPosition: 'end',
            verticalPosition: 'bottom'
          });
        },
        error: (err) => {
          console.error('Reservation failed', err)
          this.snackBar.open('Failed to reserve cart', '✖', {
            duration: 3000,
            panelClass: ['snackbar-error'],
            horizontalPosition: 'end',
            verticalPosition: 'bottom'
          });
        }
      });
    }
  }

  unreserveCart(): void {
    if (!this.cart) return;

    if(!this.isLoggedIn()) {
      this.snackBar.open(`Login to unreserve cart`, '✖', {
        duration: 3000,
        panelClass: ['snackbar-error'],
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
      return;
    }

    this.cartService.changeCartStatus(this.cart.id.toString(), 'new').subscribe({
      next: () => {
        this.isReserved = false;
        console.log('Cart unreserved');
        this.snackBar.open(`Reservation successfully removed`, '✖', {
          duration: 3000,
          panelClass: ['snackbar-success'],
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      },
      error: (err) => {
        console.error('Failed to unreserve cart', err)
        this.snackBar.open('Failed to remove reservation', '✖', {
          duration: 3000,
          panelClass: ['snackbar-error'],
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  placeOrder() {
    if (!this.cart) return;

    if(!this.isLoggedIn()) {
      this.snackBar.open(`Login to place order`, '✖', {
        duration: 3000,
        panelClass: ['snackbar-error'],
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
      return;
    }

    const dialogRef = this.matDialog.open(CheckoutDialogComponent, {
      width: '400px',
      data: { cart: this.cart }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Updated Cart:', result);
        this.cartService.order(result).subscribe(
          updated => {
            console.log('Order successfully placed', updated);
            this.snackBar.open(`Order successfully placed`, '✖', {
              duration: 3000,
              panelClass: ['snackbar-success'],
              horizontalPosition: 'end',
              verticalPosition: 'bottom'
            });
            this.loadCart();
          },
          error => {
            console.error('Failed to place order', error);
            this.snackBar.open(`Failed to place order`, '✖', {
              duration: 3000,
              panelClass: ['snackbar-error'],
              horizontalPosition: 'end',
              verticalPosition: 'bottom'
            });
          }
        );
      }
    });
  }

  // submitForm(submitForm: FormGroup) {
  //   this.form = submitForm;
  //   console.log(submitForm)
  // }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const paddedMins = mins < 10 ? '0' + mins : mins;
    const paddedSecs = secs < 10 ? '0' + secs : secs;
    return `${paddedMins}:${paddedSecs}`;
  }

  isLoggedIn() {
    return !!localStorage.getItem('currentUserId');
  }
}
