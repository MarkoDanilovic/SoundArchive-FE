import {IArtist} from "./artist";

export interface IPaginationArtist {
  currentPage: number;
  pagesCount: number;
  pageSize: number;
  totalCount: number;
  items: IArtist[];
}
