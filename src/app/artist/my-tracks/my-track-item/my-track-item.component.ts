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

  constructor(public dialog: MatDialog, private artistService: ArtistService, private snackBar: MatSnackBar) {
    this.artistId = Number(localStorage.getItem('currentUserArtistId'));
  }

  ngOnInit(): void {
  }

  openUpdateTrackDialog(): void {
    const dialogRef = this.dialog.open(UpdateTrackDialogComponent, {
      width: '600px',
      data: {track: this.track, genres: this.genres, mediums: this.mediums}
    });

    dialogRef.afterClosed().subscribe((updatedTrack: ITrack | null) => {
      if (updatedTrack) {
        this.track = updatedTrack;
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
        this.snackBar.open(`"${this.track.name}" was deleted successfully.`, 'Close', {
          duration: 3000,
        });
        this.itemRemoved.emit();
      },
      error: (err) => {
        console.error('Failed to delete track', err);
        this.snackBar.open(`Failed to delete "${this.track.name}". Please try again.`, 'Close', {
          duration: 4000,
        });
      }
    });
  }

}
