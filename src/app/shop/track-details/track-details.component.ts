import { Component, OnInit } from '@angular/core';
import {ITrack} from "../../shared/models/track";
import {ShopService} from "../shop.service";
import {ActivatedRoute} from "@angular/router";
import {WishlistService} from "../../wishlist/wishlist.service";
import {IRecord} from "../../shared/models/record";
import {environment} from "../../../environments/environment";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ImageService} from "../../core/image.service";

@Component({
  selector: 'app-track-details',
  templateUrl: './track-details.component.html',
  styleUrls: ['./track-details.component.scss']
})
export class TrackDetailsComponent implements OnInit {

  track:ITrack

  userId: number = Number(localStorage.getItem('currentUserId'));

  isInWishlist: boolean = false;

  imageBaseUrl = environment.imageBaseUrl

  constructor(private shopService: ShopService,
              private activateRoute: ActivatedRoute,
              private wishlistService: WishlistService,
              private snackBar: MatSnackBar,
              private imageService: ImageService
  ) { }

  ngOnInit(): void {
    this.loadTrack()
  }


  loadTrack(){
    this.shopService.getTrack(+this.activateRoute.snapshot.paramMap.get('id')).subscribe(track => {
      this.track = track
      this.isTrackInWishlist(this.track.id)
    }, error => {
      console.log(error)
    })
  }

  addToCart(trackId: number, mediumId: number) {
    this.shopService.addToCart(trackId, mediumId)
    console.log("Track details added to cart " + trackId + " " + mediumId);
    this.snackBar.open(`Track successfully added to cart`, '✖', {
      duration: 3000,
      panelClass: ['snackbar-success'],
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
    return null;
  }

  addTrackToWishlist(trackId: number) {
    this.wishlistService.addToWishlist(this.userId, trackId).subscribe(
      () => {
        console.log('Track added to wishlist successfully!');
        this.isInWishlist = true;
      },
      (error) => {
        console.error('Error adding track to wishlist:', error);
      }
    );
  }

  removeTrackFromWishlist(trackId: number) {
    this.wishlistService.removeFromWishlist(this.userId, trackId).subscribe(
      () => {
        console.log('Track removed from wishlist successfully!');
        this.isInWishlist = false;
      },
      (error) => {
        console.error('Error removing track from wishlist:', error);
      }
    );
  }

  isTrackInWishlist(trackId: number): void {

    this.wishlistService.checkWishlist(this.userId, trackId).subscribe(
      (result) => {
        console.log('Track is in the wishlist.');
        this.isInWishlist = result
      },
      (error) => {
        console.log(error);
        this.isInWishlist = false
      }
    );
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
}
