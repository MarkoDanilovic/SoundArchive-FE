import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {IPagination} from "../../shared/models/pagination";
import {ITrack} from "../../shared/models/track";
import {ShopService} from "../../shop/shop.service";
import {ShopParams} from "../../shared/models/shopParams";

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.scss']
})
export class TracksComponent implements OnInit {

  @ViewChild('search', {static:true}) searchTerm: ElementRef
  tracks?: IPagination;
  shopParams = new ShopParams();

  constructor(private shopService: ShopService) {}

  ngOnInit(): void {
    this.loadTracks();
  }

  loadTracks(page: number = this.shopParams.pageNumber): void {
    this.shopParams.pageNumber = page;

    this.shopService.getProducts(this.shopParams).subscribe({
      next: response => this.tracks = response,
      error: err => console.error('Failed to load tracks', err)
    });
  }

  handleAction(event: { type: string, item: ITrack }) {
    console.log(`${event.type} action on track`, event.item);
    // Implement edit/delete logic here
  }

  onSearch(){
    this.shopParams.search = this.searchTerm.nativeElement.value
    this.shopParams.pageNumber=1
    this.loadTracks()
  }

  onReset(){
    this.searchTerm.nativeElement.value='';
    this.shopParams = new ShopParams();
    this.loadTracks()
  }
}
