import { Elysia } from "elysia";
import { createContainer } from "./container";
import { healthModule } from "./modules/health";
import { createIdentityModule } from "./modules/identity/interface/http";
import { createOrganizationModule } from "./modules/organization/interface/http";
import { appErrorHandler } from "./shared/middleware/errorHandler";

export const buildApp = () => {

  const container = createContainer()


  const identityModule = createIdentityModule(container.identity.service.authService)

  const organizationModule = createOrganizationModule(
    container.organization.service.organization
  )

  const app = new Elysia()
    .use(appErrorHandler)
    .group("/api", (app) => app
      .use(healthModule)
      .use(identityModule)
      .use(organizationModule),
    )
    .get("/health", () => ({ status: "ok", timestamp: new Date() }))
    .listen(3000);

  return app;
};

export type App = ReturnType<typeof buildApp>;
