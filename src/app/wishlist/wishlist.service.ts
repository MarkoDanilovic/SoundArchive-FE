import { Injectable } from '@angular/core';
import {ShopParams} from "../shared/models/shopParams";
import {HttpClient, HttpParams} from "@angular/common/http";
import {IPagination} from "../shared/models/pagination";
import {map} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  wishlistBaseUrl = environment.wishlistBaseUrl

  constructor(private http: HttpClient) { }

  getWishlist(userId: number, shopParams: ShopParams) {
    let params = new HttpParams();

    params = params.append('page', shopParams.pageNumber.toString())
    params = params.append('size', shopParams.pageSize.toString())
    params = params.append('order', shopParams.order.toString());
    params = params.append('sortBy', 'trackId');

    return this.http.get<IPagination>(`${this.wishlistBaseUrl}/user/${userId}`, {observe: 'response', params})
      .pipe(
        map(response => {
          return response.body
        })
      )
  }

  addToWishlist(userId: number, trackId: number) {

    console.log(this.wishlistBaseUrl)
    console.log("User: " + userId + ", Track: " + trackId)

    return this.http.post<null>(`${this.wishlistBaseUrl}`, {userId, trackId}, {observe: 'response'})
      .pipe(
        map(response => {
          console.log('API Response:', response)
          return null
        })
      )
  }

  removeFromWishlist(userId: number, trackId: number) {

    return this.http.delete<null>(`${this.wishlistBaseUrl}/user/${userId}/track/${trackId}`, { observe: 'response' })
      .pipe(
        map(response => {
          return null;
        })
      );
  }

  checkWishlist(userId: number, trackId: number) {
    console.log("This is being called service");

    return this.http.get<boolean>(`${this.wishlistBaseUrl}/user/${userId}/track/${trackId}`, { observe: 'response' })
      .pipe(
        map(response => {
          return response.body;
        })
      );
  }
}
