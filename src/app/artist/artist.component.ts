import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {IArtist} from "../shared/models/artist";
import {ArtistParams} from "../shared/models/artistParams";
import {ArtistService} from "./artist.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.scss']
})
export class ArtistComponent implements OnInit {
  @ViewChild('search', {static:true}) searchTerm: ElementRef
  artists : IArtist[]

  artistParams : ArtistParams = new ArtistParams()
  totalCount: number

  sortOptions = [
    {name: 'Ascending', value:'asc'},
    {name: 'Descending', value:'desc'}
  ]

  constructor(private artistService: ArtistService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getArtists();
  }

  getArtists() {
    this.artistService.getArtists(this.artistParams).subscribe(response => {
      this.artists = response.items
      this.artistParams.page = response.currentPage
      this.artistParams.size = response.pageSize
      this.totalCount = response.totalCount
    }, error => {
      console.log(error)
      this.artists = null
      if(error.status === 404){
        this.snackBar.open('No artist found', '✖', {//No artist found
          duration: 3000,
          panelClass: ['snackbar-error'],
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      }
      else {
        this.snackBar.open('Failed to load list of artists', '✖', {
          duration: 3000,
          panelClass: ['snackbar-error'],
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      }
    })
  }

  onSortSelected(order: string) {
    this.artistParams.order = order
    this.getArtists()
  }

  onPageChanged(event: any){
    if(this.artistParams.page !== event){
      this.artistParams.page = event
      this.getArtists()
    }
  }

  onSearch() {
    this.artistParams.name = this.searchTerm.nativeElement.value
    this.artistParams.page = 1
    this.getArtists()
  }

  onReset() {
    this.searchTerm.nativeElement.value=''
    this.artistParams = new ArtistParams()
    this.getArtists()
  }
}
