import {Injectable, Output} from '@angular/core';
import {BehaviorSubject, catchError, Observable, tap, throwError} from "rxjs";
import {AddCartItem, CartItem} from "../shared/models/cartitem";
import {HttpClient} from "@angular/common/http";
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

    const payload: AddCartItem = {
      userId,
      id: cart.id.toString(),
      trackId,
      mediumId
    };
    console.log("This is the payload: " + payload.userId + " " + payload.id + " " + payload.trackId + " " + payload.mediumId + " ");

    return this.httpClient.put<Cart>(`${this.cartBaseUrl}/addToCart`, payload).pipe(
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

    const payload: AddCartItem = {
      userId,
      id: cart.id.toString(),
      trackId,
      mediumId
    };

    return this.httpClient.put<Cart>(`${this.cartBaseUrl}/removeFromCart`, payload).pipe(
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

  reserveCart(cartId: number): Observable<void> {
    return this.httpClient.post<void>(`${this.cartBaseUrl}/reserve/${cartId}`, {}).pipe(
      tap(() => console.log(`Cart ${cartId} reserved`)),
      catchError(err => {
        console.error('Failed to reserve cart', err);
        return throwError(() => new Error('Could not reserve cart'));
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
    const url = `${this.cartBaseUrl}/${cartId}/changeStatus/${status}`;
    console.log(`Sending PUT request to change status of cart ${cartId} to ${status}`);

    return this.httpClient.put<void>(url, {}).pipe(
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


  // getTracksCart(){
  //   return this.trackList.asObservable();
  // }
  //
  // setTrackCart(track: any){
  //   this.cartItemList.push(...track);
  //   this.trackList.next(track);
  // }
  //
  // addToCart(track: any, record: IRecord){
  //   this.cartItemList.push(track)
  //   this.trackList.next(this.cartItemList)
  //   this.getTotalPrice();
  //   console.log(this.cartItemList)
  // }
  //
  // getTotalPrice(): number{//mora price da cita iz recorda, pri tome da proveri koji medium je u pitanju
  //   let grandTotal = 0;
  //   this.cartItemList.map((a:any) => {
  //     grandTotal += a.price;
  //   })
  //   return grandTotal;
  // }//da li uopste ovde da se racuna, jer se racuna na back-u
  //
  // removeCartITem(track : any){
  //   this.cartItemList.map((a:any, index:any) => {
  //     if(track.id === a.id){
  //       this.cartItemList.splice(index,1)
  //     }
  //   })
  //   //console.log(this.cartItemList)
  //   this.trackList.next(this.cartItemList)
  // }
  //
  // removeAllCart(){
  //   this.cartItemList = []
  //   this.cartItems = []
  //   this.trackList.next(this.cartItemList)
  // }
  //
  //
  // addCartItem(track: ITrack, record: IRecord) {
  //   let cartItem = new CartItem();
  //   cartItem.trackId = track.id;
  //   cartItem.itemQuantity = 1
  //   //this.cart.cartItems.push(cartItem);
  //
  //   /*
  //   this.httpClient.post<CartItem>('https://localhost:1296/api/cartitem', cartItem).subscribe(data => {
  //     console.log(data)
  //   });
  //   */
  //   this.cartItems.push(cartItem)
  //   console.log(this.cartItems)
  // }
  //
  // addCart(form: FormGroup){
  //
  //
  //   // this.cart.firstName = form.get('firstName').value;
  //   // this.cart.lastName = form.get('lastName').value;
  //   this.cart.address = form.get('address').value;
  //   this.cart.city = form.get('city').value;
  //   this.cart.status = 'initial'//stavi neku opciju reserve koju ce da cita
  //   this.cart.paymentMethod = form.get('paymentMethod').value
  //   this.cart.cartItems = this.cartItems
  //   this.cart.comment = form.get('comment').value
  //   this.cart.subtotal = this.getTotalPrice()
  //   this.cart.userId = +localStorage.getItem('currentUserId')
  //   console.log(this.cart)
  //
  //   this.httpClient.post<Cart>('http://localhost:8081/api/soundArchive/cart', this.cart).subscribe(data => {
  //     console.log(data.id)
  //     //this.requestMemberSession(data.id)
  //   });
  //   this.removeAllCart()
  //   this.mat.closeAll()
  //
  //
  //
  // }
}
