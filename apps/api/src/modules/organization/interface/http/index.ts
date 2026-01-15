import Elysia from "elysia";
import type { OrganizationService } from "../../service/organization";
import { createOrganizationRouter } from "./organization.router";

export const createOrganizationModule = (organizationService: OrganizationService) => {

  const organizationRouter = createOrganizationRouter({
    organizationService: organizationService
  });
  return new Elysia({ prefix: "/organization" })
    .use(organizationRouter);
};
