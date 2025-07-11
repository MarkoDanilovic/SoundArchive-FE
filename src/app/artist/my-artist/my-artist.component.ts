import { Component, OnInit } from '@angular/core';
import {IArtist} from "../../shared/models/artist";
import {ArtistService} from "../artist.service";
import {environment} from "../../../environments/environment";
import { MatDialog } from '@angular/material/dialog';
import {UpdateArtistDialogComponent} from "./update-artist-dialog/update-artist-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ImageService} from "../../core/image.service";

@Component({
  selector: 'app-my-artist',
  templateUrl: './my-artist.component.html',
  styleUrls: ['./my-artist.component.scss']
})
export class MyArtistComponent implements OnInit {

  artistData?: IArtist;
  imageBaseUrl = environment.imageBaseUrl

  constructor(private artistService: ArtistService,
              private matDialog: MatDialog,
              private snackBar: MatSnackBar,
              private imageService: ImageService
  ) {}

  ngOnInit(): void {
    const artistIdString = localStorage.getItem('currentUserArtistId');

    if (artistIdString) {
      const artistId = Number(artistIdString);

      this.artistService.getArtist(artistId).subscribe({
        next: (artist: IArtist) => {
          this.artistData = artist;
        },
        error: err => {
          console.error('Failed to load artist information ', err);
          this.snackBar.open('Failed to load artist information', '✖', {
            duration: 3000,
            panelClass: ['snackbar-error'],
            horizontalPosition: 'end',
            verticalPosition: 'bottom'
          });
        }
      });
    } else {
      console.warn('No artist ID found in local storage.');
    }
  }

  updateArtist(): void {
    if (!this.artistData) return;

    const dialogRef = this.matDialog.open(UpdateArtistDialogComponent, {
      data: { ...this.artistData }
    });

    dialogRef.afterClosed().subscribe((updatedArtist: IArtist | null) => {
      if (updatedArtist) {
        this.artistData = updatedArtist;
        console.log('Artist updated successfully: ', updatedArtist);
      }
    });
  }

  getArtistImageUrl(baseUrl: string, picture: string | null | undefined, artistId: number): string {

    return this.imageService.getArtistImageUrl(baseUrl, picture, this.artistData.id);
  }
}
