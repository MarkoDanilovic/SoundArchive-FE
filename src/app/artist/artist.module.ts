import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArtistRoutingModule } from './artist-routing.module';
import { ArtistComponent } from './artist.component';
import { ArtistItemComponent } from './artist-item/artist-item.component';
import { ArtistDetailsComponent } from './artist-details/artist-details.component';
import {SharedModule} from "../shared/shared.module";
import {ShopModule} from "../shop/shop.module";
import { MyArtistComponent } from './my-artist/my-artist.component';
import { MyTracksComponent } from './my-tracks/my-tracks.component';
import { UpdateArtistDialogComponent } from './my-artist/update-artist-dialog/update-artist-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import { MyTrackItemComponent } from './my-tracks/my-track-item/my-track-item.component';
import { UpdateTrackDialogComponent } from './my-tracks/update-track-dialog/update-track-dialog.component';
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import { CreateTrackDialogComponent } from './my-tracks/create-track-dialog/create-track-dialog.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";


@NgModule({
  declarations: [
    ArtistComponent,
    ArtistItemComponent,
    ArtistDetailsComponent,
    MyArtistComponent,
    MyTracksComponent,
    UpdateArtistDialogComponent,
    MyTrackItemComponent,
    UpdateTrackDialogComponent,
    CreateTrackDialogComponent
  ],
    imports: [
        CommonModule,
        ArtistRoutingModule,
        SharedModule,
        ShopModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatOptionModule,
        MatSelectModule,
        MatIconModule,
        MatSnackBarModule
    ]
})
export class ArtistModule { }
