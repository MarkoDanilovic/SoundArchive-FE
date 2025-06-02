import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot, UrlSegment,
  UrlTree
} from '@angular/router';
import {map, Observable} from 'rxjs';
import {AuthService} from "./auth.service";
import {LoggingService} from "../core/logging.service";

@Injectable({
  providedIn: 'root'
})
export class GuardGuard implements CanActivate, CanLoad {

  constructor(private auth: AuthService, private router: Router) {
  }





  canActivate() {
    console.log("Ulazi u canactivate")
    if(this.auth.isLoggedIn()){
      console.log("LOGOVAN ADMIN")
      return true;
    }
    else {
      this.router.navigate(['home'])
      return false;
    }
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return Number(localStorage.getItem('currentUserRole')) === 3;
  }

}
