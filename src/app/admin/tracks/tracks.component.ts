import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {IPaginationTrack, ITrack, ITrackSearch} from "../../shared/models/track";
import {AdminService} from "../admin.service";
import {UpdateTrackDialogComponent} from "../../artist/my-tracks/update-track-dialog/update-track-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {IGenre} from "../../shared/models/genre";
import {IMedium} from "../../shared/models/medium";

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.scss']
})
export class TracksComponent implements OnInit {
  @ViewChild('search', { static: true }) searchTerm!: ElementRef;

  tracks?: IPaginationTrack;
  trackSearchParams: ITrackSearch = {
    page: 1,
    size: 10,
    order: 'asc',
    sortBy: 'name',
    name: '',
    genreId: 0,
    mediumId: 0,
    artistName: '',
    artistId: 0
  };

  displayedColumns: string[] = ['name', 'duration', 'publishDate', 'genre', 'artist', 'actions'];

  genres: IGenre[]
  mediums: IMedium[]

  constructor(private adminService: AdminService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadTracks();
    this.loadGenre();
    this.loadMediums();
  }

  loadTracks(page: number = this.trackSearchParams.page): void {
    this.trackSearchParams.page = page;

    this.adminService.getTracks(this.trackSearchParams).subscribe({
      next: response => this.tracks = response,
      error: err => console.error('Failed to load tracks', err)
    });
  }

  loadGenre() {
    this.adminService.getGenres().subscribe({
      next: res => this.genres = res,
      error: err => console.error('Failed to load genres', err)
    });
  }

  loadMediums() {
    this.adminService.getMediums().subscribe({
      next: res => this.mediums = res,
      error: err => console.error('Failed to load mediums', err)
    });
  }

  handleAction(event: { type: string; item: ITrack }) {
    console.log(`${event.type} action on track`, event.item);
    // Place edit/delete logic here
  }

  onSearch() {
    this.trackSearchParams.name = this.searchTerm.nativeElement.value;
    this.trackSearchParams.page = 1;
    this.loadTracks();
  }

  onReset() {
    this.searchTerm.nativeElement.value = '';
    this.trackSearchParams = {
      page: 1,
      size: 10,
      order: 'asc',
      sortBy: 'name',
      name: '',
      genreId: 0,
      mediumId: 0,
      artistName: '',
      artistId: 0
    };
    this.loadTracks();
  }

  onPageChanged(event: any) {
    this.loadTracks(event.pageIndex + 1);
  }


  editTrack(track: ITrack) {
    this.openUpdateTrackDialog(track);
  }


  openUpdateTrackDialog(track: ITrack): void {
    const dialogRef = this.dialog.open(UpdateTrackDialogComponent, {
      width: '600px',
      data: {track: track, genres: this.genres, mediums: this.mediums}
    });

    dialogRef.afterClosed().subscribe((updatedTrack: ITrack | null) => {
      if (updatedTrack) {
        this.loadTracks();
        console.log('Updated Track: ', updatedTrack);
      }
    });
  }

  deleteTrack(id: number) {
    if (!confirm('Are you sure you want to delete this track?')) {
      return;
    }

    this.adminService.deleteTrack(id).subscribe({
      next: () => {
        this.loadTracks();
      },
      error: err => console.error('Failed to delete track', err)
    });
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const paddedMins = mins < 10 ? '0' + mins : mins;
    const paddedSecs = secs < 10 ? '0' + secs : secs;
    return `${paddedMins}:${paddedSecs}`;
  }
}
