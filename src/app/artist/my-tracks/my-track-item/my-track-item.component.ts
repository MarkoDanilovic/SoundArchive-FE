import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ITrack} from "../../../shared/models/track";
import {UpdateTrackDialogComponent} from "../update-track-dialog/update-track-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {IGenre} from "../../../shared/models/genre";
import {IMedium} from "../../../shared/models/medium";
import {environment} from "../../../../environments/environment";
import {ConfirmationDialogComponent} from "../../../shared/confirmation-dialog/confirmation-dialog.component";
import {ArtistService} from "../../artist.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ImageService} from "../../../core/image.service";

@Component({
  selector: 'app-my-track-item',
  templateUrl: './my-track-item.component.html',
  styleUrls: ['./my-track-item.component.scss']
})
export class MyTrackItemComponent implements OnInit {

  @Input() track: ITrack;
  @Input() genres: IGenre[] = [];
  @Input() mediums: IMedium[] = [];
  @Output() itemRemoved = new EventEmitter<void>();

  imageBaseUrl = environment.imageBaseUrl

  artistId: number;

  cacheBuster = new Date().getTime();

  constructor(public dialog: MatDialog,
              private artistService: ArtistService,
              private snackBar: MatSnackBar,
              private imageService: ImageService) {
    this.artistId = Number(localStorage.getItem('currentUserArtistId'));
  }

  ngOnInit(): void {
  }

  get displayImageUrl(): string {
    if (this.track?.picture) {
      // cache-busting
      return `${this.imageBaseUrl}${this.track.picture}?v=${this.cacheBuster}`;
    } else {
      return '/assets/discogs.png';
    }
  }

  openUpdateTrackDialog(): void {
    const dialogRef = this.dialog.open(UpdateTrackDialogComponent, {
      width: '600px',
      data: {track: this.track, genres: this.genres, mediums: this.mediums}
    });

    dialogRef.afterClosed().subscribe((updatedTrack: ITrack | null) => {
      if (updatedTrack) {
        this.track = updatedTrack;
        this.cacheBuster = new Date().getTime();
        console.log('Updated Track: ', updatedTrack);
      }
    });
  }

  confirmDelete() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        heading: 'Delete Track',
        message: `Are you sure you want to delete "${this.track.name}"?`,
        confirmText: 'Yes, delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTrack();
      }
    });
  }

  deleteTrack() {
    this.artistService.deleteTrack(this.track.id).subscribe({
      next: () => {
        this.snackBar.open(`Track successfully deleted`, '✖', {
          duration: 3000,
          panelClass: ['snackbar-success'],
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
        this.itemRemoved.emit();
      },
      error: (err) => {
        console.error('Failed to delete track', err);
        this.snackBar.open('Failed to delete track', '✖', {
          duration: 3000,
          panelClass: ['snackbar-error'],
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const paddedMins = mins < 10 ? '0' + mins : mins;
    const paddedSecs = secs < 10 ? '0' + secs : secs;
    return `${paddedMins}:${paddedSecs}`;
  }

  getTrackImageUrl(baseUrl: string, picture: string | null | undefined, trackId: number): string {

    return this.imageService.getTrackImageUrl(baseUrl, picture, this.track.id);
  }
}
