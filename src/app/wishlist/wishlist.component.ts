import { Component, OnInit } from '@angular/core';
import {ITrack} from "../shared/models/track";
import {ShopParams} from "../shared/models/shopParams";
import {WishlistService} from "./wishlist.service";

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {

  tracks: ITrack[]

  shopParams = new ShopParams()
  totalCount: number

  userId: number;

  constructor(private wishlistService: WishlistService) {
    this.userId = Number(localStorage.getItem('currentUserId'));
  }

  ngOnInit(): void {
    this.getWishlist()
  }

  getWishlist(){
    this.wishlistService.getWishlist(this.userId, this.shopParams).subscribe(response => {
      this.tracks = response.items
      this.shopParams.pageNumber = response.currentPage
      this.shopParams.pageSize = response.pageSize
      this.totalCount = response.totalCount
    }, error => {
      console.log(error)
      this.tracks = null;
    })
  }

  onPageChanged(event: any){
    if(this.shopParams.pageNumber !== event){
      this.shopParams.pageNumber = event
      this.getWishlist()
    }

  }

  onItemRemoved() {
    this.getWishlist();
  }

}
