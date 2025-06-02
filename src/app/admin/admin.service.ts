import { Injectable } from '@angular/core';
import {IGenre} from "../shared/models/genre";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {IMedium} from "../shared/models/medium";
import {IPaginationUser, IUpdateUser, IUser, IUserSearch} from "../shared/models/user";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  genreBaseUrl = environment.genreBaseUrl;
  mediumBaseUrl = environment.mediumBaseUrl;
  userBaseUrl = environment.userBaseUrl;

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
}
