import { Injectable } from '@angular/core';
import {IGenre} from "../shared/models/genre";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {IMedium} from "../shared/models/medium";
import {IPaginationUser, IUpdateUser, IUser, IUserSearch} from "../shared/models/user";
import {Cart, ICartSearch, IPaginationCart} from "../shared/models/cart";
import {IPaginationTrack, ITrackSearch} from "../shared/models/track";
import {IPagination} from "../shared/models/pagination";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  genreBaseUrl = environment.genreBaseUrl;
  mediumBaseUrl = environment.mediumBaseUrl;
  userBaseUrl = environment.userBaseUrl;
  cartBaseUrl = environment.cartBaseUrl;
  trackBaseUrl = environment.trackBaseUrl;

  constructor(private httpClient: HttpClient) { }


  getGenres() {
    return this.httpClient.get<IGenre[]>(this.genreBaseUrl);
  }

  addGenre(name: string) {
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.post<IGenre>(this.genreBaseUrl, { name }, { headers });
  }

  updateGenre(genre: IGenre) {
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.put<IGenre>(this.genreBaseUrl, genre, { headers });
  }

  deleteGenre(id: number) {
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.delete(`${this.genreBaseUrl}/${id}`, { headers });
  }

  getMediums() {
    return this.httpClient.get<IMedium[]>(this.mediumBaseUrl);
  }

  addMedium(name: string) {
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.post<IMedium>(this.mediumBaseUrl, { name }, { headers });
  }

  updateMedium(medium: IMedium) {
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.put<IMedium>(this.mediumBaseUrl, medium, { headers });
  }

  deleteMedium(id: number) {
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.delete(`${this.mediumBaseUrl}/${id}`, { headers });
  }


  getUsers(searchParams: IUserSearch) {
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let params = new HttpParams()
      .set('page', searchParams.page.toString())
      .set('size', searchParams.size.toString())
      .set('order', searchParams.order)
      .set('sortBy', searchParams.sortBy);
      //.set('firstName', searchParams.firstName || '')
      //.set('lastName', searchParams.lastName || '')
    if(searchParams.username) {
      params = params.append('username', searchParams.username);
    }

    return this.httpClient.get<IPaginationUser>(`${this.userBaseUrl}`, { params, headers });
  }

  updateUser(id: number, user: IUpdateUser) {
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.put(`${this.userBaseUrl}/${id}`, user, { headers });
  }

  deleteUser(id: number) {

    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.delete(`${this.userBaseUrl}/${id}`, { headers });
  }


  getOrders(searchParams: ICartSearch) {
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let params = new HttpParams()
      .set('page', searchParams.page.toString())
      .set('size', searchParams.size.toString())
      .set('order', searchParams.order)
      .set('sortBy', searchParams.sortBy);

    if(searchParams.status) {
      params = params.append('status', searchParams.status);
    }

    return this.httpClient.get<IPaginationCart>(`${this.cartBaseUrl}`, { params, headers });
  }

  cancelOrder(orderId: string) {
    return this.httpClient.put(`${this.cartBaseUrl}/${orderId}/changeStatus/cancelled`, {});
  }

  getTracks(trackSearchParams: ITrackSearch) {

    let params = new HttpParams()
      .set('page', trackSearchParams.page.toString())
      .set('size', trackSearchParams.size.toString())
      .set('order', trackSearchParams.order)
      .set('sortBy', trackSearchParams.sortBy);

    if(trackSearchParams.name){
      params = params.append('name', trackSearchParams.name)
    }

    if(trackSearchParams.genreId !== 0){
      params = params.append('genreId', trackSearchParams.genreId)
    }

    if(trackSearchParams.mediumId !== 0){
      params = params.append('mediumId', trackSearchParams.mediumId)
    }

    if(trackSearchParams.artistName) {
      params = params.append('artistName', trackSearchParams.artistName);
    }

    if(trackSearchParams.artistId !== 0){
      params = params.append('artistId', trackSearchParams.artistId)
    }

    return this.httpClient.get<IPaginationTrack>(`${this.trackBaseUrl}`, { params });
  }

  deleteTrack(id: number) {

    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.delete(`${this.trackBaseUrl}/${id}`, { headers });
  }
}
