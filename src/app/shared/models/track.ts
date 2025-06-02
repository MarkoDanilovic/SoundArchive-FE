import {IGenre} from "./genre";
import {IArtist} from "./artist";
import {IRecord} from "./record";

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
