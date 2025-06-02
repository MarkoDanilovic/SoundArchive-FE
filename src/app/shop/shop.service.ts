import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {IPagination} from "../shared/models/pagination";
import {IGenre} from "../shared/models/genre";
import {IMedium} from "../shared/models/medium";
import {map} from "rxjs";
import {ShopParams} from "../shared/models/shopParams";
import {ITrack} from "../shared/models/track";
import {BasketService} from "../basket/basket.service";
import {IRecord} from "../shared/models/record";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient, private cartService: BasketService) { }

  getProducts(shopParams: ShopParams){
    let params = new HttpParams();

    params = params.append('page', shopParams.pageNumber.toString())
    params = params.append('size', shopParams.pageSize.toString())
    params = params.append('order', shopParams.order.toString());
    params = params.append('sortBy', shopParams.sort.toString());

    if(shopParams.search){
      params = params.append('name', shopParams.search.toString())
    }

    if(shopParams.genreId !== 0){
      params = params.append('genreId', shopParams.genreId)//.toString())
    }

    if(shopParams.mediumId !== 0){
      params = params.append('mediumId', shopParams.mediumId)//.toString())
    }

    if(shopParams.artistName) {
      params = params.append('artistName', shopParams.artistName);
    }

    if(shopParams.artistId !== 0){
      params = params.append('artistId', shopParams.artistId)//.toString())
    }

    return this.http.get<IPagination>(this.baseUrl + '/track', {observe: 'response', params})
      .pipe(
        map(response => {
          console.log('API Response:', response);
          return response.body
        })
      )
  }

  getTrack(id:number){
    return this.http.get<ITrack>(this.baseUrl + '/track/' + id)
  }


  getGenres(){
    return this.http.get<IGenre[]>(this.baseUrl+'/genre')
  }

  getMediums(){
    return this.http.get<IMedium[]>(this.baseUrl+'/medium')
  }

  addToCart(trackId: number, mediumId: number){
    return this.cartService.addToCart(trackId, mediumId).subscribe({
      next: () => {
        console.log("Item added to cart");
      },
      error: (err) => {
        console.error("Error adding item to cart", err);
      }
    });
  }
}
