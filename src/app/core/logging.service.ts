import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserLogin} from "../shared/models/userLogin";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {RegisterUser} from "../shared/models/registerUser";
import {BehaviorSubject, catchError, map, Observable, switchMap, tap} from "rxjs";
import {IPersistedUser} from "../shared/models/persistedUser";
import {IUpdateUser, IUser} from "../shared/models/user";
import {environment} from "../../environments/environment";
import {IPasswordChange} from "../shared/models/passwordChange";
import {IArtist} from "../shared/models/artist";

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  authBaseUrl = environment.authBaseUrl//'http://localhost:8080/api/soundArchive/auth'
  userBaseUrl = environment.userBaseUrl
  artistBaseUrl = environment.artistBaseUrl

  invalidLogin: boolean
  private currentUserSource = new BehaviorSubject<IPersistedUser>(null);
  currentUser$ = this.currentUserSource.asObservable();
  currentUserId : number;


  constructor(private httpClient: HttpClient,private mat: MatDialog, private router: Router) { }

  login(user: UserLogin): Observable<{ user: IUser, token: string }> {
    return this.httpClient.post(this.authBaseUrl + "/login", user, { responseType: 'text' }).pipe(
      switchMap((token: string) => {
        localStorage.setItem("jwt", token);
        //this.currentUserSource.next(persistedUser);

        return this.httpClient.get<IUser>(this.authBaseUrl + "/username/" + user.username).pipe(
          map((userInfo) => {
            localStorage.setItem("currentUserId", userInfo.id.toString());
            localStorage.setItem("currentUsername", userInfo.username);
            localStorage.setItem("currentUserRole", userInfo.permissionLevel);

            if(userInfo.artistId != null) localStorage.setItem("currentUserArtistId", userInfo.artistId.toString());

            return { user: userInfo, token };
          })
        );
      })
    );
  }




  logout(){
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('currentUserRole');
    localStorage.removeItem('jwt');

    if(!!localStorage.getItem('currentUserArtistId')) localStorage.removeItem('currentUserArtistId');

    this.router.navigateByUrl('/home')
    location.reload()

    console.log(localStorage.getItem('currentUserId'))
  }

  registerUser(user: RegisterUser): Observable<IUser>{
    console.log(user)

    return this.httpClient.post<IUser>(this.authBaseUrl + "/register", user).pipe(
      tap(response => {
        console.log(response);
        this.mat.closeAll();
      }),
      catchError(error => {
        console.log(error);
        throw error;
      })
    );
  }

  getCurrentUser(): Observable<IUser> {
    const userId = localStorage.getItem('currentUserId');
    const token = localStorage.getItem('jwt');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.get<IUser>(`${this.userBaseUrl}/${userId}`, { headers }).pipe(
      tap(response => {
        console.log(response);
        return response;
      }),
      catchError(error => {
        console.log(error);
        throw error;
      })
    );
  }

  changePassword(passwordChange: IPasswordChange): Observable<void> {
    return this.httpClient.put<void>(`${this.authBaseUrl}/changePassword`, passwordChange).pipe(
      tap(response => {
        console.log(response);
        return response;
      }),
      catchError(error => {
        console.log(error);
        throw error;
      })
    );
  }

  updateUser(updatedUser: IUpdateUser) {
    const userId = localStorage.getItem('currentUserId');
    const token = localStorage.getItem('jwt');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.put<IUser>(`${this.userBaseUrl}/${userId}`, updatedUser, { headers }).pipe(
      tap(response => {
        console.log("logging service update user called successfully");
        console.log(response);
        return response;
      }),
      catchError(error => {
        console.log(error);
        throw error;
      })
    );
  }

  // createArtist(artist: IArtist): Observable<IArtist> {
  //   const token = localStorage.getItem('jwt');
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${token}`
  //   });
  //
  //
  //   return this.httpClient.post<IArtist>(`${this.artistBaseUrl}`, artist, { headers }).pipe(
  //     tap(response => {
  //       console.log("logging service create artist called successfully");
  //       console.log(response);
  //       localStorage.setItem("currentUserArtistId", response.id.toString())
  //       return response;
  //     }),
  //     catchError(error => {
  //       console.log(error);
  //       throw error;
  //     })
  //   );
  // }

  createArtist(artist: IArtist): Observable<IArtist> {
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });


    return this.httpClient.post<IArtist>(`${this.artistBaseUrl}`, artist, { headers }).pipe(
      tap(response => {
        console.log("logging service create artist called successfully");
        console.log(response);

        this.updateUserArtist(response.id);

        return response;
      }),
      catchError(error => {
        console.log(error);
        throw error;
      })
    );
  }

  updateUserArtist(artistId : number) {
    const token = localStorage.getItem('jwt');
    const userId = localStorage.getItem('currentUserId');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    console.log("\n\n\n updateUserArtist is being called with artistId: " + artistId + ", userId: " + userId + "\n\n\n")

    this.httpClient.put<IUser>(`${this.userBaseUrl}/updateUserArtist/userId/${userId}/artistId/${artistId}`, {},{ headers }).pipe(
      tap(response => {
        console.log("logging service update artistId in user called successfully");
        console.log(response);

        localStorage.setItem("currentUserArtistId", response.artistId.toString())
      }),
      catchError(error => {
        console.log(error);
        throw error;
      })
    ).subscribe();
  }
}
