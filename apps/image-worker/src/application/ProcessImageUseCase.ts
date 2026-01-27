import type { IMessageBroker, IStorageService } from "@superdawn/core";
import sharp from "sharp";

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
    console.log(`Worker received Image ID: ${data.imageId} with Key: ${data.storageKey}`);

    const { buffer } = await this.storage.download(data.storageKey);

    const resolutions = [
      { name: "thumb", width: 100 },
      { name: "medium", width: 500 },
      { name: "large", width: 1024 },
    ];


    const variants = await Promise.all(resolutions.map(async (res) => {
      const resizedBuffer = await sharp(buffer)
        .resize({ width: res.width })
        .toBuffer();

      const newKey = `processed/${data.imageId}-${res.name}.jpg`;
      await this.storage.upload(newKey, resizedBuffer, "image/jpeg");

      return { resolution: res.name, key: newKey }
    }))

    console.log(`[Worker] ${data.imageId}, ${JSON.stringify(variants)}`)


    await this.broker.publish("image_results_queue", {
      imageId: data.imageId,
      status: "completed",
      variants: variants,
    });
  };
}
