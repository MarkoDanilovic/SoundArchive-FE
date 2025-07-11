import { Component, OnInit } from '@angular/core';
import {IArtist} from "../../shared/models/artist";
import {ArtistService} from "../artist.service";
import {ActivatedRoute} from "@angular/router";
import {ITrack} from "../../shared/models/track";
import {ShopParams} from "../../shared/models/shopParams";
import {ShopService} from "../../shop/shop.service";
import {environment} from "../../../environments/environment";
import {ImageService} from "../../core/image.service";

@Component({
  selector: 'app-artist-details',
  templateUrl: './artist-details.component.html',
  styleUrls: ['./artist-details.component.scss']
})
export class ArtistDetailsComponent implements OnInit {

  artist: IArtist

  tracks : ITrack[]

  shopParams = new ShopParams()
  totalCount: number

  imageBaseUrl = environment.imageBaseUrl

  constructor(private artistService: ArtistService,
              private activatedRoute: ActivatedRoute,
              private shopService: ShopService,
              private imageService: ImageService
  ) { }

  ngOnInit(): void {
    this.loadArtist()
  }

  loadArtist(){
    this.artistService.getArtist(+this.activatedRoute.snapshot.paramMap.get('id')).subscribe(artist => {
      this.artist = artist

      this.shopParams.artistId = artist.id
      console.log("On loadArtist:" + this.artist.artistName)

      this.getTracks()

    }, error => {
      console.log(error)
    })
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

  onPageChanged(event: any){
    if(this.shopParams.pageNumber !== event){
      this.shopParams.pageNumber = event
      this.getTracks()
    }

  }

  getArtistImageUrl(baseUrl: string, picture: string | null | undefined, artistId: number): string {

    return this.imageService.getArtistImageUrl(baseUrl, picture, this.artist.id);
  }
}
