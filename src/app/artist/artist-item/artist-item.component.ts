import {Component, Input, OnInit} from '@angular/core';
import {IArtist} from "../../shared/models/artist";
import {ArtistService} from "../artist.service";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-artist-item',
  templateUrl: './artist-item.component.html',
  styleUrls: ['./artist-item.component.scss']
})
export class ArtistItemComponent implements OnInit {

  @Input() artist: IArtist;

  imageBaseUrl = environment.imageBaseUrl

  constructor(private artistService: ArtistService) { }

  ngOnInit(): void {
  }
}
