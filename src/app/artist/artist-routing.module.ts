import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ArtistComponent} from "./artist.component";
import {ArtistDetailsComponent} from "./artist-details/artist-details.component";
import {MyTracksComponent} from "./my-tracks/my-tracks.component";
import {MyArtistComponent} from "./my-artist/my-artist.component";

const routes: Routes = [
  { path: '', component:ArtistComponent },
  { path: 'my-artist', component: MyArtistComponent },
  { path: 'my-tracks', component: MyTracksComponent },
  { path: ':id', component: ArtistDetailsComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArtistRoutingModule { }
