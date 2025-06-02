import {Component, Input, OnInit} from '@angular/core';
import {ITrack} from "../../shared/models/track";
import {ShopComponent} from "../shop.component";
import {ShopService} from "../shop.service";
import {environment} from "../../../environments/environment";


@Component({
  selector: 'app-track-item',
  templateUrl: './track-item.component.html',
  styleUrls: ['./track-item.component.scss']
})
export class TrackItemComponent implements OnInit {

  @Input() track : ITrack;

  imageBaseUrl = environment.imageBaseUrl

  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
  }

  // addToCart(track: any){
  //   this.shopService.addToCart(track);
  //   return null;
  // }
}
