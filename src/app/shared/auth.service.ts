import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  isLoggedIn(){
    if(localStorage.getItem('role') === 'Admin'){
      console.log(!!localStorage.getItem('role'))
      return !!localStorage.getItem('role')
    } else{
      return null
    }
  }
}
