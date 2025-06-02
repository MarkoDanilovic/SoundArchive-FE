import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {catchError, map, Observable, tap} from "rxjs";
import {ITrack} from "../shared/models/track";
import {ArtistParams} from "../shared/models/artistParams";
import {IPaginationArtist} from "../shared/models/paginationArtist";
import {IArtist} from "../shared/models/artist";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ArtistService {

  baseUrl = 'http://localhost:8080/api/soundArchive/'
  artistBaseUrl = environment.artistBaseUrl
  trackBaseUrl = environment.trackBaseUrl

  constructor(private httpClient: HttpClient) { }

  getArtists(artistParams: ArtistParams){
    let params = new HttpParams();

    params = params.append('page', artistParams.page.toString())
    params = params.append('size', artistParams.size.toString())
    params = params.append('order', artistParams.order.toString());
    params = params.append('sortBy', artistParams.sortBy.toString());

    if(artistParams.name){
      params = params.append('name', artistParams.name.toString())
    }

    return this.httpClient.get<IPaginationArtist>(this.artistBaseUrl, {observe: 'response', params})
      .pipe(
        map(response => {
          console.log('API Response:', response);
          return response.body
        })
      )
  }

  getArtist(id:number){
    return this.httpClient.get<IArtist>(`${this.artistBaseUrl}/${id}`)
      .pipe(
        map(response => {
          console.log('API Response:', response);
          return response
        })
      )
  }

  updateArtist(artist: IArtist): Observable<IArtist> {

    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.put<IArtist>(`${this.artistBaseUrl}`, artist, { headers }).pipe(
      tap(response => {
        console.log("Artist service update artist called successfully");
        console.log(response);
        return response;
      }),
      catchError(error => {
        console.log(error);
        throw error;
      })
    );
  }

  updateTrack(track: ITrack) {
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    console.log("In artist service update track pre call track:");
    console.log(track);

    return this.httpClient.put<ITrack>(`${this.trackBaseUrl}/${track.id}`, track, { headers }).pipe(
      tap(response => {
        console.log("In artist service update track called successfully");
        console.log(response);
        return response;
      }),
      catchError(error => {
        console.log(error);
        throw error;
      })
    );
  }

  createTrack(track: ITrack) {
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    console.log("In artist service create track pre call track:");
    console.log(track);

    return this.httpClient.post<ITrack>(`${this.trackBaseUrl}`, track, { headers }).pipe(
      tap(response => {
        console.log("In artist service create track called successfully");
        console.log(response);
        return response;
      }),
      catchError(error => {
        console.log(error);
        throw error;
      })
    );
  }

  deleteTrack(trackId: number) {
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    console.log("In artist service delete track pre call trackId: " + trackId);

    return this.httpClient.delete<ITrack>(`${this.trackBaseUrl}/${trackId}`, { headers }).pipe(
      tap(response => {
        console.log("In artist service delete track called successfully on trackId: " + trackId);
        console.log(response);
        return response;
      }),
      catchError(error => {
        console.log(error);
        throw error;
      })
    );
  }
}
