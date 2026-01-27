import type { ImageProcessingEvent } from "@superdawn/core";
import { MinioStorage, RabbitMQBroker } from "@superdawn/core";
import { ProcesImageUseCase } from "./application/ProcessImageUseCase";

async function startWorker() {
  console.log(`starting worker service`);

  const broker = new RabbitMQBroker();
  const storage = new MinioStorage();

  try {
    await broker.connect();
    await storage.initialize();
  } catch (err) {
    console.error("failed to connect infrastructure", err);
    process.exit(1);
  }

  const processUseCase = new ProcesImageUseCase(storage, broker);

  await broker.subscribe(
    "image_processing_queue",
    async (msg: ImageProcessingEvent) => {
      try {
        await processUseCase.execute({
          imageId: msg.imageId,
          storageKey: msg.storageKey,
        });
      } catch (error) {
        console.error(`failed to process job for ${msg.imageId}`, error);
        throw error;
      }
    },
  );
}

startWorker();
