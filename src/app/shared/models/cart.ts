import {CartItem} from "./cartitem";
import {MatTableDataSource} from "@angular/material/table";

export class Cart{
  id: number
  orderDate = new Date();
  subtotal: number;
  comment: string;
  paymentMethod: string;
  status: string;
  address: string;
  city: string;
  userId: number
  items? : CartItem[] = [];// | MatTableDataSource<CartItem>;
}


