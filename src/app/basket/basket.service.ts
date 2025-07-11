import {Injectable, Output} from '@angular/core';
import {BehaviorSubject, catchError, Observable, tap, throwError} from "rxjs";
import {AddCartItem, CartItem} from "../shared/models/cartitem";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {FormGroup} from "@angular/forms";
import {Cart} from "../shared/models/cart";
import {MatDialog} from "@angular/material/dialog";
import {IRecord} from "../shared/models/record";
import {ITrack} from "../shared/models/track";
import {environment} from "../../environments/environment";
import {MatTableDataSource} from "@angular/material/table";


@Injectable({
  providedIn: 'root'
})
export class BasketService {

  // public cartItemList : any = [];
  //
  // public cart : Cart = new Cart();
  // cartItems = [] as CartItem[];

  cartBaseUrl = environment.cartBaseUrl;

  // public trackList = new BehaviorSubject<any>([]);
  //
  // loggedIn = localStorage.getItem('role');

  constructor(private httpClient: HttpClient, private mat: MatDialog) { }

  private cartSubject = new BehaviorSubject<Cart | null>(null);
  cart$ = this.cartSubject.asObservable();

  loadCart(): Observable<Cart> {
    const userId = Number(localStorage.getItem("currentUserId"));
    console.log("Cart loaded for user: " + userId)

    return this.httpClient.get<Cart>(`${this.cartBaseUrl}/unordered/user/${userId}`).pipe(
      tap(cart => {
        this.cartSubject.next(cart);
        console.log("Successfully retrieved unordered carts! ");
        //return this.cartSubject.asObservable();
      }),
      catchError(err => {
        console.error("Failed to load cart", err);
        return throwError(() => new Error('Could not load cart'));
      })
    );
  }

  addToCart(trackId: number, mediumId: number): Observable<Cart> {
    console.log("Cart service, Adding to cart " + trackId + " " + mediumId);

    const cart = this.cartSubject.value;
    const userId = Number(localStorage.getItem("currentUserId"));

    if (!cart) {
      this.loadCart();
    }

    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const payload: AddCartItem = {
      userId,
      id: cart.id.toString(),
      trackId,
      mediumId
    };
    console.log("This is the payload: " + payload.userId + " " + payload.id + " " + payload.trackId + " " + payload.mediumId + " ");

    return this.httpClient.put<Cart>(`${this.cartBaseUrl}/addToCart`, payload, {headers}).pipe(
      //tap(updatedCart => this.cartSubject.next(updatedCart)),
      tap(updatedCart => {
        this.cartSubject.next(updatedCart); // Update the cart in the BehaviorSubject
        //console.log("Pre load Successfully called addToCart" + trackId + " " + mediumId);
        //this.loadCart(); // After a successful update, reload the cart
        console.log("Successfully called addToCart" + trackId + " " + mediumId);
      }),
      catchError(err => {
        console.error("Failed to add to cart", err);
        return throwError(() => new Error('Could not add item to cart'));
      })
    );
  }

  removeFromCart(trackId: number, mediumId: number): Observable<Cart> {
    const cart = this.cartSubject.value;
    const userId = Number(localStorage.getItem("currentUserId"));

    if (!cart) {
      return throwError(() => new Error('Cart not loaded'));
    }

    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const payload: AddCartItem = {
      userId,
      id: cart.id.toString(),
      trackId,
      mediumId
    };

    return this.httpClient.put<Cart>(`${this.cartBaseUrl}/removeFromCart`, payload, {headers}).pipe(
      tap(updatedCart => {
        this.cartSubject.next(updatedCart); // Update the cart in the BehaviorSubject
        //console.log("Pre load Successfully called removeFromCart" + trackId + " " + mediumId);
        //this.loadCart(); // After a successful update, reload the cart
        console.log("Successfully called removeFromCart" + trackId + " " + mediumId);
      }),
      catchError(err => {
        console.error("Failed to remove from cart", err);
        return throwError(() => new Error('Could not remove item from cart'));
      })
    );
  }

  getCartItemCount(): number {
    const cart = this.cartSubject.value;
    console.log(cart);
    const items = cart?.items || [];
    return items.length;
  }


  changeCartStatus(cartId: string, status: string): Observable<void> {
    console.log(`Sending PUT request to change status of cart ${cartId} to ${status}`);

    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.put<void>(`${this.cartBaseUrl}/${cartId}/changeStatus/${status}`, {}, {headers}).pipe(
      tap(() => {
        console.log(`Successfully changed status of cart ${cartId} to ${status}`);
      }),
      catchError(err => {
        console.error(`Failed to change status for cart ${cartId}:`, err);
        return throwError(() => new Error('Could not change cart status'));
      })
    );
  }

  getCart(): Cart | null {
    return this.cartSubject.value;
  }


  order(cart: Cart) {
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.put<Cart>(`${this.cartBaseUrl}/order`, cart, {headers}).pipe(
      tap(updatedCart => {
        console.log(`Order successfully placed`);

        return updatedCart
      }),
      catchError(err => {
        console.error(`Failed to place order`, err);
        return throwError(() => new Error('Failed to place order'));
      })
    );
  }
}
