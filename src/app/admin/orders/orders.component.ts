import { Component, OnInit } from '@angular/core';
import {Cart, CartStatus, ICartSearch, IPaginationCart} from "../../shared/models/cart";
import {AdminService} from "../admin.service";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      state('expanded', style({ height: '*', opacity: 1 })),
      transition('expanded <=> collapsed', animate('300ms ease-in-out'))
    ])
  ]
})
export class OrdersComponent implements OnInit {
  orders: Cart[] = [];
  totalCount = 0;
  expandedElement: Cart | null = null;

  statusOptions = Object.values(CartStatus);

  searchParams: ICartSearch = {
    page: 1,
    size: 10,
    order: 'desc',
    sortBy: 'orderDate',
    status: ''
  };

  displayedColumns: string[] = ['id', 'orderDate', 'address', 'subtotal', 'comment', 'status', 'actions'];

  itemColumns: string[] = ['track', 'mediumId', 'itemQuantity', 'price'];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.adminService.getOrders(this.searchParams).subscribe({
      next: (res: IPaginationCart) => {
        this.orders = res.items;
        this.totalCount = res.totalCount;
      },
      error: err => console.error('Failed to load orders', err)
    });
  }

  onStatusChange() {
    this.searchParams.page = 1;
    this.loadOrders();
  }

  onPageChanged(newPage: number) {
    this.searchParams.page = newPage;
    this.loadOrders();
  }

  cancelOrder(orderId: string) {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    this.adminService.cancelOrder(orderId).subscribe({
      next: () => {
        console.log(`Order ${orderId} cancelled successfully.`);
        this.loadOrders();
      },
      error: (err) => {
        console.error('Failed to cancel order', err);
      }
    });
  }
}
