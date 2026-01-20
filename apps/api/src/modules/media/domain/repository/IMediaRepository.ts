import type { Media, NewMedia } from "../entities/MediaEntity";

export interface IMediaRepository {
  save: (data: NewMedia) => Promise<Media>;
  getById: (id: string) => Promise<Media | null>;
  update: (id: string, data: Partial<NewMedia>) => Promise<Media | null>;
}
