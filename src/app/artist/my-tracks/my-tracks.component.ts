import { Component, OnInit } from '@angular/core';
import {ITrack} from "../../shared/models/track";
import {ShopParams} from "../../shared/models/shopParams";
import {environment} from "../../../environments/environment";
import {ShopService} from "../../shop/shop.service";
import {IGenre} from "../../shared/models/genre";
import {IMedium} from "../../shared/models/medium";
import {CreateTrackDialogComponent} from "./create-track-dialog/create-track-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {IArtist} from "../../shared/models/artist";
import {ArtistService} from "../artist.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-my-tracks',
  templateUrl: './my-tracks.component.html',
  styleUrls: ['./my-tracks.component.scss']
})
export class MyTracksComponent implements OnInit {

  tracks : ITrack[]
  genres: IGenre[] = [];
  mediums: IMedium[] = [];
  artist: IArtist;

  artistId: number = Number(localStorage.getItem('currentUserArtistId'));

  shopParams = new ShopParams()
  totalCount: number

  imageBaseUrl = environment.imageBaseUrl

  constructor(private shopService: ShopService, private artistService: ArtistService, public dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadArtist();
    this.loadGenres();
    this.loadMediums();

    this.shopParams.artistId = this.artistId;
    this.loadTracks();
  }

  loadTracks(){
    this.shopService.getProducts(this.shopParams).subscribe(response => {
      this.tracks = response.items
      this.shopParams.pageNumber = response.currentPage
      this.shopParams.pageSize = response.pageSize
      this.totalCount = response.totalCount
    }, error => {
      console.log(error)
      this.tracks = null;
      this.snackBar.open('Tracks not found', '✖', {
        duration: 3000,
        panelClass: ['snackbar-error'],
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
    })
  }

  loadGenres(): void {
    this.shopService.getGenres().subscribe(genres => {
      this.genres = genres;
    });
  }

  loadMediums(): void {
    this.shopService.getMediums().subscribe(mediums => {
      this.mediums = mediums;
    });
  }

  loadArtist() {
    this.artistService.getArtist(this.artistId).subscribe(artist => {
      this.artist = artist;
    })
  }

  onPageChanged(event: any){
    if(this.shopParams.pageNumber !== event){
      this.shopParams.pageNumber = event
      this.loadTracks()
    }

  }

  onItemRemoved() {
    this.loadTracks();
  }

  openCreateTrackDialog() {
    this.dialog.open(CreateTrackDialogComponent, {
      width: '600px',
      data: {
        genres: this.genres,
        mediums: this.mediums,
        artist: this.artist
      }
    }).afterClosed().subscribe(result => {
      this.loadTracks();
    });
  }
}
