import Elysia from "elysia";
import type { IPropertyService } from "../../domain/entity/property.entity";
import { createPropertyRouter } from "./property.router";

type PropertyModuleConfig = {
  propertyService: IPropertyService,
}

export const createPropertyModule = (config: PropertyModuleConfig) => {
  const propertyRouter = createPropertyRouter({
    propertyService: config.propertyService
  })

  return new Elysia({ prefix: "/property" })
    .use(propertyRouter);
}
