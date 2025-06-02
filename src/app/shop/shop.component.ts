import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ShopService} from "./shop.service";
import {ITrack} from "../shared/models/track";
import {IGenre} from "../shared/models/genre";
import {IMedium} from "../shared/models/medium";
import {ShopParams} from "../shared/models/shopParams";

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  @ViewChild('search', {static:true}) searchTerm: ElementRef
  @ViewChild('searchArtist', { static: true }) searchArtist: ElementRef;
  tracks : ITrack[]
  genres: IGenre[]
  mediums : IMedium[]

  shopParams = new ShopParams()
  totalCount: number

  sortOptions = [
    {name: 'Alphabetical ascending', value:'asc'},
    {name: 'Alphabetical descending', value:'desc'}
  ]

  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
    this.getTracks()
    this.getGenres()
    this.getMediums()
  }


  getTracks(){
    this.shopService.getProducts(this.shopParams).subscribe(response => {
      this.tracks = response.items
      this.shopParams.pageNumber = response.currentPage
      this.shopParams.pageSize = response.pageSize
      this.totalCount = response.totalCount
    }, error => {
      console.log(error)
      this.tracks = null;
    })
  }

  getGenres(){
    this.shopService.getGenres().subscribe(response => {
      this.genres = [{id:0, name:'All'},...response]
    },error => {
      console.log(error)
    })
  }

  getMediums(){
    this.shopService.getMediums().subscribe(response => {
      this.mediums = [{id:0, name:'All'},...response]
    },error => {
      console.log(error)
    })
  }

  onGenreSelected(genreId: number){
    this.shopParams.genreId =genreId;
    this.shopParams.pageNumber=1
    this.getTracks()
  }

  onMediumSelected(mediumId: number){
    this.shopParams.mediumId =mediumId;
    this.shopParams.pageNumber=1
    this.getTracks()
  }

  onSortSelected(order: string){
    this.shopParams.order = order;
    this.getTracks()
  }

  onPageChanged(event: any){
    if(this.shopParams.pageNumber !== event){
      this.shopParams.pageNumber = event
      this.getTracks()
    }

  }

  onSearch(){
    this.shopParams.search = this.searchTerm.nativeElement.value
    this.shopParams.artistName = this.searchArtist.nativeElement.value
    this.shopParams.pageNumber=1
    this.getTracks()
  }

  onReset(){
    this.searchTerm.nativeElement.value='';
    this.searchArtist.nativeElement.value='';
    this.shopParams = new ShopParams();
    this.getTracks()
  }

  onSearchArtist(){
    this.shopParams.artistName = this.searchArtist.nativeElement.value
    this.shopParams.pageNumber=1
    this.getTracks()
  }
}
