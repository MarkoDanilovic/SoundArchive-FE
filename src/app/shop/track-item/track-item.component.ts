import {Component, Input, OnInit} from '@angular/core';
import {ITrack} from "../../shared/models/track";
import {ShopComponent} from "../shop.component";
import {ShopService} from "../shop.service";
import {environment} from "../../../environments/environment";
import {ImageService} from "../../core/image.service";


@Component({
  selector: 'app-track-item',
  templateUrl: './track-item.component.html',
  styleUrls: ['./track-item.component.scss']
})
export class TrackItemComponent implements OnInit {

  @Input() track : ITrack;

  imageBaseUrl = environment.imageBaseUrl

  constructor(private shopService: ShopService, private imageService: ImageService) { }

  ngOnInit(): void {
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

  // addToCart(track: any){
  //   this.shopService.addToCart(track);
  //   return null;
  // }
}
