import sharp from "sharp";
import { IStorageService } from "@superdawn/core";
import { IMessageBroker } from "@superdawn/core";

export interface ProcessImageDTO {
  imageId: string;
  storageKey: string;
}

export class ProcesImageUseCase {
  constructor(
    private storage: IStorageService,
    private broker: IMessageBroker,
  ) {}

  execute = async (data: ProcessImageDTO): Promise<void> => {
    console.log(`processing image: ${data.imageId}`);

    const originalBuffer = await this.storage.download(data.storageKey);

    const resolutions = [
      { name: "thumb", width: 100 },
      { name: "medium", width: 500 },
      { name: "large", width: 1024 },
    ];

    const results: unknown[] = [];

    for (const res of resolutions) {
      const resizedBuffer = await sharp(originalBuffer)
        .resize({ width: res.width })
        .toBuffer();

      const newKey = `processed/${data.imageId}-${res.name}.jpg`;

      await this.storage.upload(newKey, resizedBuffer, "image/jpeg");

      results.push({
        resolution: res.name,
        key: newKey,
      });

      console.log(`generated ${res.name}`);
    }

    await this.broker.publish("image_results_queue", {
      imageId: data.imageId,
      status: "completed",
      variants: results,
    });
  };
}
