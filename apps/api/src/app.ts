import { Elysia } from "elysia";
import { createIdentityModule } from "./modules/identity/transport/http";
import { appErrorHandler } from "./shared/middleware/errorHandler";

export const buildApp = () => {
  const identityModule = createIdentityModule();

  const app = new Elysia()
    .use(appErrorHandler)
    .group("/api", (app) => app.use(identityModule))
    .get("/health", () => ({ status: "ok", timestamp: new Date() }))
    .listen(3000);

  return app;
};
