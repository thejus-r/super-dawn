import type { IMediaRepository } from "./domain/repository/IMediaRepository.ts";
import type {
  IMessageBroker,
  IStorageService,
  ImageResultEvent,
} from "@superdawn/core";
import { ImageService } from "./services/Image.service.ts";
import Elysia from "elysia";
import { registerImageRoutes } from "./presentation/http/image.router.ts";

export * from "./domain/entities/MediaEntity.ts";
export * from "./infrastructure/repository/media.repository";

export type MediaModuleConfig = {
  mediaRepository: IMediaRepository;
  messageBroker: IMessageBroker;
  storageService: IStorageService;
};

/**
 * This initializes the required dependencies and returns
 * an sub-route for the module "media"
 *
 * Responsibilties:
 *  - Initialize Services
 *  - Initialize UseCases
 */
export const createMediaModule = async (config: MediaModuleConfig) => {
  const { mediaRepository, messageBroker, storageService } = config;

  const imageService = new ImageService(
    mediaRepository,
    storageService,
    messageBroker,
  );

  await messageBroker.subscribe<ImageResultEvent>(
    "image_results_queue",
    async (msg) => {
      await imageService.handleProcessingResult(msg);
    },
  );

  const imageRoutes = registerImageRoutes(imageService);

  return new Elysia({ prefix: "media" }).use(imageRoutes);
};
