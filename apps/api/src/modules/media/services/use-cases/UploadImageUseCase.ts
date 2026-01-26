import { randomUUID } from "node:crypto";
import type { IMessageBroker, IStorageService } from "@superdawn/core";
import { Image } from "@superdawn/core";

export interface UploadRequestDTO {
  file: Buffer;
  filename: string;
  mimeType: string;
}

export class UploadImageUseCase {
  constructor(
    private storage: IStorageService,
    private broker: IMessageBroker,
  ) {}

  async execute(request: UploadRequestDTO) {
    const imageId = randomUUID();
    const image = new Image(
      imageId,
      request.filename,
      request.mimeType,
      request.file.length,
    );

    const storageKey = `originals/${image.id}-${image.filename}`;

    await this.storage.upload(storageKey, request.file, image.mimeType);

    const eventPayload = {
      imageId: image.id,
      storageKey: storageKey,
      bucket: "images",
    };

    await this.broker.publish("image_processing_queue", eventPayload);

    return { success: true, id: image.id, status: "processing" };
  }
}
