import {Component, Input, OnInit} from '@angular/core';
import {BasketService} from "./basket.service";
import {HttpClient} from "@angular/common/http";
import {CartItem} from "../shared/models/cartitem";
import {ITrack} from "../shared/models/track";
import {MatDialog} from "@angular/material/dialog";
import {CheckoutDialogComponent} from "./checkout-dialog/checkout-dialog.component";
import {Form, FormGroup} from "@angular/forms";
import {Cart} from "../shared/models/cart";

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {

  cart : Cart | null = null;

  isReserved: boolean = false;

  @Input() form : FormGroup;
  constructor(protected cartService: BasketService, private httpClient:HttpClient, private matDialog: MatDialog) { }

  ngOnInit(): void {
    // this.cartService.loadCart().subscribe(cart => {
    //   this.cart = cart;
    //   console.log("BasketComponent. This is the id of the cart: " + cart.id)
    // });

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
    });
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.trackId, item.mediumId).subscribe(updatedCart => {
      this.cart = updatedCart;
    });
  }

  getCartItemCount() {
    return this.cartService.getCartItemCount();
  }

  // Method to toggle the cart status between reserved and new
  toggleReserve(): void {
    if (!this.cart) return;

    const newStatus = this.isReserved ? 'new' : 'reserved';

    this.cartService.changeCartStatus(this.cart.id.toString(), newStatus).subscribe({
      next: () => {
        this.isReserved = !this.isReserved;  // Toggle the button state
        console.log(`Cart status changed to: ${newStatus}`);
      },
      error: (err) => console.error('Error changing cart status:', err)
    });
  }

  // Reserve the cart (set status to "reserved")
  reserveCart(): void {
    if (!this.cart) return;

    // If the cart is not reserved, reserve it
    if (!this.isReserved) {
      this.cartService.changeCartStatus(this.cart.id.toString(), 'reserved').subscribe({
        next: () => {
          this.isReserved = true;
          console.log('Cart reserved');
        },
        error: (err) => console.error('Reservation failed', err)
      });
    }
  }

  unreserveCart(): void {
    if (!this.cart) return;

    this.cartService.changeCartStatus(this.cart.id.toString(), 'new').subscribe({
      next: () => {
        this.isReserved = false;
        console.log('Cart unreserved');
      },
      error: (err) => console.error('Failed to unreserve cart', err)
    });
  }

  placeOrder(): void {
    if (!this.cart) return;

    this.cartService.changeCartStatus(this.cart.id.toString(), 'ordered').subscribe({
      next: () => console.log('Cart status set to ordered'),
      error: (err) => console.error('Failed to place order', err)
    });
  }

  openDialog() {
    this.matDialog.open(CheckoutDialogComponent)
  }

  submitForm(submitForm: FormGroup) {
    this.form = submitForm;
    console.log(submitForm)
  }
}
