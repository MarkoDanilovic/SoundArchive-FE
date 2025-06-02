import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {GuardGuard} from "./shared/guard.guard";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'shop', loadChildren: () => import('./shop/shop.module').then(mod => mod.ShopModule) },
  { path: 'artist', loadChildren: () => import('./artist/artist.module').then(mod => mod.ArtistModule) },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(mod => mod.AdminModule), canLoad:[GuardGuard] },
  { path: 'basket', loadChildren: () => import('./basket/basket.module').then(mod => mod.BasketModule) },
  { path: 'wishlist', loadChildren: () => import('./wishlist/wishlist.module').then(m => m.WishlistModule) },
  { path: 'my-user', loadChildren: () => import('./core/core.module').then(m => m.CoreModule) },
  { path: '**', redirectTo:'',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
