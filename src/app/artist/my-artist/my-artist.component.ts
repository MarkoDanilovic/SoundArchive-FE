import { Component, OnInit } from '@angular/core';
import {IArtist} from "../../shared/models/artist";
import {ArtistService} from "../artist.service";
import {environment} from "../../../environments/environment";
import { MatDialog } from '@angular/material/dialog';
import {UpdateArtistDialogComponent} from "./update-artist-dialog/update-artist-dialog.component";

@Component({
  selector: 'app-my-artist',
  templateUrl: './my-artist.component.html',
  styleUrls: ['./my-artist.component.scss']
})
export class MyArtistComponent implements OnInit {

  artistData?: IArtist;
  imageBaseUrl = environment.imageBaseUrl

  constructor(private artistService: ArtistService, private matDialog: MatDialog) {}

  ngOnInit(): void {
    const artistIdString = localStorage.getItem('currentUserArtistId');

    if (artistIdString) {
      const artistId = Number(artistIdString);

      this.artistService.getArtist(artistId).subscribe({
        next: (artist: IArtist) => {
          this.artistData = artist;
        },
        error: err => {
          console.error('Failed to fetch artist data:', err);
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
}
