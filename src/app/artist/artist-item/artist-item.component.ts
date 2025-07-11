import {Component, Input, OnInit} from '@angular/core';
import {IArtist} from "../../shared/models/artist";
import {ArtistService} from "../artist.service";
import {environment} from "../../../environments/environment";
import {ImageService} from "../../core/image.service";

@Component({
  selector: 'app-artist-item',
  templateUrl: './artist-item.component.html',
  styleUrls: ['./artist-item.component.scss']
})
export class ArtistItemComponent implements OnInit {

  @Input() artist: IArtist;

  imageBaseUrl = environment.imageBaseUrl

  constructor(private artistService: ArtistService, private imageService: ImageService) { }

  ngOnInit(): void {
  }

  getArtistImageUrl(baseUrl: string, picture: string | null | undefined, artistId: number): string {

    return this.imageService.getArtistImageUrl(baseUrl, picture, this.artist.id);
  }
}
