import type { ImageResult } from "../entities/Image";

export interface ImageProcessingEvent {
  imageId: string;
  storageKey: string;
  bucket?: string;
}

export interface ImageResultEvent {
  imageId: string;
  status: string;
  variants: ImageResult[];
}
