import {ITrack} from "./track";

export interface IPagination {
  currentPage: number;
  pagesCount: number;
  pageSize: number;
  totalCount: number;
  items: ITrack[];
}
