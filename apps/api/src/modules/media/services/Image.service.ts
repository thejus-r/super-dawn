import type {
  IMessageBroker,
  ImageResultEvent,
  IStorageService,
} from "@superdawn/core";
import { Image } from "@superdawn/core";
import { AppError } from "@/shared/utils/AppError";
import type { IMediaRepository } from "../domain/repository/IMediaRepository";

export interface UploadRequestDTO {
  file: Buffer;
  filename: string;
  mimeType: string;
}

export class ImageService {
  constructor(
    private readonly mediaRepo: IMediaRepository,
    private readonly storage: IStorageService,
    private readonly broker: IMessageBroker,
  ) {}

  /**
  * Uploads the original image to storage and calls,
  * image worker via message broker to optimize the image greedly
  */
  uploadImage = async (request: UploadRequestDTO) => {

    const newMedia = await this.mediaRepo.save({
      originalName: request.filename,
      mimeType: request.mimeType,
    });

    const image = new Image(
      newMedia.id,
      request.filename,
      request.mimeType,
      request.file.length,
    );

    console.log(`starting upload workflow for ${image.id}`);

    const storageKey = `originals/${image.id}`;

    // store in blob storage
    await this.storage.upload(storageKey, request.file, image.mimeType);

    // dispatch event to worker
    await this.broker.publish("image_processing_queue", {
      imageId: image.id,
      storageKey: storageKey,
      bucket: "images",
    });

    return {
      success: true,
      id: image.id,
      key:storageKey,
      status: "pending",
    };
  };

  handleProcessingResult = async (event: ImageResultEvent) => {
    const { imageId, variants } = event;
    console.log(`[media-module] received processed images for: ${imageId}`);
    await this.mediaRepo.update(imageId, {
      variants: variants,
    });
  };

  getImage = async (key: string) => {

    try {
      return await this.storage.download(key)
    } catch (error) {
      console.error(`Failed to fetch image: ${key}`, error);
      throw new AppError({
        message: 'image not found',
        statusCode: 404
      })
    }
  }
}
