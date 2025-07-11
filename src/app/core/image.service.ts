import { Injectable } from '@angular/core';
import {map, Observable, Subject} from 'rxjs';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {IArtist} from "../shared/models/artist";
import {ITrack} from "../shared/models/track";

@Injectable({
  providedIn: 'root',
})
export class ImageService {

  private uploadBaseUrl = environment.uploadBaseUrl;

  private trackCacheBusters = new Map<number, number>();
  private artistCacheBusters = new Map<number, number>();

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
        this.artistCacheBusters.set(id, Date.now());
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
        this.trackCacheBusters.set(id, Date.now());
        return response;
      })
    );
  }

  getTrackImageUrl(baseUrl: string, picture: string | null | undefined, trackId: number): string {
    if (!picture) {
      return '/assets/discogs.png';
    }
    const bust = this.trackCacheBusters.get(trackId) ?? 0;
    return `${baseUrl}${picture}?v=${bust}`;
  }

  getArtistImageUrl(baseUrl: string, picture: string | null | undefined, artistId: number): string {
    if (!picture) {
      return '/assets/artist-placeholder.png';
    }
    const bust = this.artistCacheBusters.get(artistId) ?? 0;
    return `${baseUrl}${picture}?v=${bust}`;
  }

  bustCacheForArtist(artistId: number): void {
    this.artistCacheBusters.set(artistId, Date.now());
  }

  bustCacheForTrack(trackId: number): void {
    this.trackCacheBusters.set(trackId, Date.now());
  }
}
