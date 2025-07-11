import {IGenre} from "./genre";
import {IArtist} from "./artist";
import {IRecord} from "./record";
import {IUser} from "./user";

export interface ITrack {
  id: number
  name: string
  duration: number
  publishDate: string
  picture: string
  genre: IGenre
  artist: IArtist
  records: IRecord[]
}

export interface IPaginationTrack {
  currentPage: number;
  pagesCount: number;
  pageSize: number;
  totalCount: number;
  items: ITrack[];
}

export interface ITrackSearch {
  page: number;
  size: number;
  order: string;
  sortBy: string;
  name: string;
  genreId: number;
  mediumId: number;
  artistName: string;
  artistId: number;
}
