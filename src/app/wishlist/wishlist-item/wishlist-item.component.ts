import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WishlistService} from "../wishlist.service";
import {ITrack} from "../../shared/models/track";
import {environment} from "../../../environments/environment";
import {ImageService} from "../../core/image.service";

@Component({
  selector: 'app-wishlist-item',
  templateUrl: './wishlist-item.component.html',
  styleUrls: ['./wishlist-item.component.scss']
})
export class WishlistItemComponent implements OnInit {

  @Input() track : ITrack;
  @Output() itemRemoved = new EventEmitter<void>();

  userId: number;

  imageBaseUrl = environment.imageBaseUrl

  constructor(private wishlistService: WishlistService, private imageService: ImageService) {
    this.userId = Number(localStorage.getItem('currentUserId'));
  }

  ngOnInit(): void {
  }

  removeFromWishlist(): void {
    console.log('User ID:', this.userId);
    console.log('Track ID:', this.track.id);

    if (this.userId && this.track.id) {
      this.wishlistService.removeFromWishlist(this.userId, this.track.id)
        .subscribe(
          () => {
            console.log('Item removed successfully');
            this.itemRemoved.emit();
          },
          (error) => {
            console.error('Error removing item:', error);
          }
        );
    } else {
      console.error('Invalid user or track ID');
    }
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
