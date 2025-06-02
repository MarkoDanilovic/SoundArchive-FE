import {CartItem} from "./cartitem";
import {MatTableDataSource} from "@angular/material/table";

export class CartDataSource{
  id: number
  orderDate = new Date();
  subtotal: number;
  comment: string;
  firstName: string;
  lastName: string
  city: string;
  address: string;
  paymentMethod: string;
  payment: boolean;
  cartItems : MatTableDataSource<CartItem>;
}
