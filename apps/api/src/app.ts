import { Elysia } from "elysia";
import { createIdentityModule } from "./modules/identity/transport/http";
import { appErrorHandler } from "./shared/middleware/errorHandler";
import { healthModule } from "./modules/health";
import { organizationModule } from "./modules/organization";

export const buildApp = () => {
  const identityModule = createIdentityModule();

  const app = new Elysia()
    .use(appErrorHandler)
    .group("/api", (app) =>
      app.use(identityModule).use(healthModule).use(organizationModule),
    )
    .get("/health", () => ({ status: "ok", timestamp: new Date() }))
    .listen(3000);

  return app;
};

export type App = ReturnType<typeof buildApp>;
