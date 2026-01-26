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

    // We create image object, base check in class size and mime-type
    const image = new Image(
      request.filename,
      request.mimeType,
      request.file.length,
    );

    // We store original files in subfolder "originals" in image bucket
    const storageKey = `originals/${image.key}`;

    const { id: imageId } = await this.mediaRepo.save({
      key: storageKey,
      originalName: request.filename,
      mimeType: request.mimeType,
    });


    console.log(`starting upload workflow for ${imageId}`);


    // store in blob storage
    await this.storage.upload(storageKey, request.file, image.mimeType);

    // dispatch event to worker
    await this.broker.publish("image_processing_queue", {
      imageId: imageId,
      storageKey: storageKey,
      bucket: "images",
    });

    return {
      success: true,
      id: imageId,
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
