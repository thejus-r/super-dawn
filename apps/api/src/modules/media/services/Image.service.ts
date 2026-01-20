import type {
  IMessageBroker,
  IStorageService,
  ImageResultEvent,
} from "@superdawn/core";
import { Image } from "@superdawn/core";
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

    const storageKey = `orignials/${image.id}-${image.filename}`;

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
      status: "pending",
    };
  };

  handleProcessingResult = async (event: ImageResultEvent) => {
    const { imageId, variants } = event;
    console.log(`[media-module] recived processed images for: ${imageId}`);
    await this.mediaRepo.update(imageId, {
      variants: variants,
    });
  };
}
