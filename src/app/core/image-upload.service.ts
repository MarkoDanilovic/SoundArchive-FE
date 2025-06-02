import { Injectable } from '@angular/core';
import {map, Observable, Subject} from 'rxjs';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {IArtist} from "../shared/models/artist";
import {ITrack} from "../shared/models/track";

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {

  private uploadBaseUrl = environment.uploadBaseUrl;

  constructor(private http: HttpClient) {}

  uploadArtistImage(file: File, id: number): Observable<IArtist> {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<IArtist>(`${this.uploadBaseUrl}/artist/${id}`, formData, { headers }).pipe(
      map(response => {
        console.log('API Response:', response);
        return response;
      })
    );
  }

  uploadTrackImage(file: File, id: number): Observable<ITrack> {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<ITrack>(`${this.uploadBaseUrl}/track/${id}`, formData, { headers }).pipe(
      map(response => {
        console.log('API Response:', response);
        return response;
      })
    );
  }
}
