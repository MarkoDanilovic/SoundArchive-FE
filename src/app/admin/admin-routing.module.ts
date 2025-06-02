import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdminComponent} from "./admin.component";

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
      { path: 'orders', loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule) },
      { path: 'tracks', loadChildren: () => import('./tracks/tracks.module').then(m => m.TracksModule) },
      { path: 'mediums', loadChildren: () => import('./mediums/mediums.module').then(m => m.MediumsModule) },
      { path: 'genres', loadChildren: () => import('./genres/genres.module').then(m => m.GenresModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
