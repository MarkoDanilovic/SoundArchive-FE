import {IMedium} from "./medium";

export interface IRecord {
  trackId: string;
  medium: IMedium;
  quantity: number;
  price: number;
}
