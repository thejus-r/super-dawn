import Elysia from "elysia";
import type { IPropertyService } from "../../domain/entity/property.entity";
import { createPropertyRouter } from "./property.router";

export const createPropertyModule = (propertyService: IPropertyService) => {
  const propertyRouter = createPropertyRouter({
    propertyService
  })

  return new Elysia({ prefix: "/property" })
    .use(propertyRouter);
}
