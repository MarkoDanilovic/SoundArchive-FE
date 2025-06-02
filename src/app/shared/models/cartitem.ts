import {ITrack} from "./track";

export class CartItem{
  cartId: number;
  trackId: number;
  mediumId: number;
  itemQuantity: number;
  price: number;

  track: ITrack;//??
}

export class AddCartItem {
  userId: number;
  id: string;
  trackId: number;
  mediumId: number;
}
