import { Elysia } from "elysia";
import { createContainer } from "./container";
import { healthModule } from "./modules/health";
import { createIdentityModule } from "./modules/identity/interface/http";
import { createMediaModule } from "./modules/media";
import { createOrganizationModule } from "./modules/organization/interface/http";
import { createPropertyModule } from "./modules/property/interface/http";
import { appErrorHandler } from "./shared/middleware/errorHandler";

export const buildApp = async () => {
  const container = createContainer();

  // init message broker
  await container.app.messageBroker.connect();
  console.log("[buildApp]: infrastructure connected");

  const identityModule = createIdentityModule(
    container.identity.service.authService,
  );

  const propertyModule = createPropertyModule({
    propertyService: container.property.service.property,
    });

  const organizationModule = createOrganizationModule(
    container.organization.service.organization,
  );

  const mediaModule = await createMediaModule({
    mediaRepository: container.media.repository,
    messageBroker: container.app.messageBroker,
    storageService: container.app.storageService,
  });

  const app = new Elysia()
    .use(appErrorHandler)
    .group("/api", (app) =>
      app
        .use(healthModule)
        .use(identityModule)
        .use(organizationModule)
        .use(propertyModule)
        .use(mediaModule),
    )
    .get("/health", () => ({ status: "ok", timestamp: new Date() }))
    .listen(3000);

  return app;
};

export type App = ReturnType<typeof buildApp>;
