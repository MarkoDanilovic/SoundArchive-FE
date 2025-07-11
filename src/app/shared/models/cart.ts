import {CartItem} from "./cartitem";
import {MatTableDataSource} from "@angular/material/table";
import {IUser} from "./user";

export class Cart{
  id: string
  orderDate = new Date();
  subtotal: number;
  comment: string;
  paymentMethod: string;
  status: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  userId: number
  items? : CartItem[] = [];
}



export interface IPaginationCart {
  currentPage: number;
  pagesCount: number;
  pageSize: number;
  totalCount: number;
  items: Cart[];
}

export interface ICartSearch {
  page: number;
  size: number;
  order: string;
  sortBy: string;
  status: string;
}

export enum CartStatus {
  New = 'new',
  Reserved = 'reserved',
  Ordered = 'ordered',
  Cancelled = 'cancelled'
}
