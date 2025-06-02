import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { NavBarComponent } from './core/nav-bar/nav-bar.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {CoreModule} from "./core/core.module";
import {ShopModule} from "./shop/shop.module";
import {HomeModule} from "./home/home.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {JwtModule} from "@auth0/angular-jwt";
import {ErrorInterceptor} from "./core/interceptors/error.interceptor";
import {ToastrModule} from "ngx-toastr";
import {SharedModule} from "./shared/shared.module";
import {GuardGuard} from "./shared/guard.guard";


export function tokenGetter(){
  return localStorage.getItem('jwt')
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ToastrModule.forRoot({
      positionClass:'toast-bottom-right',
      preventDuplicates:true
    }),
    AppRoutingModule,
    CoreModule,
    SharedModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HomeModule,
    FormsModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter
      }
    })
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass:ErrorInterceptor, multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
