import { Elysia } from "elysia";
import { TokenProvider } from "@/modules/identity/infrastructure/providers/token.provider";
import { authMiddleware } from "@/shared/middleware/auth-middleware";
import { AppError } from "@/shared/utils/AppError";
import type { IPropertyService } from "../../domain/entity/property.entity";
import { createPropertySchema } from "../dto/property.dto";

/**
* Middleware validates the propertyId, it exists, and adds to context,
* If not found, we can return early, from these end points
*/

type PropertyRouterConfig = {
  propertyService: IPropertyService;
}

export const createPropertyRouter = (config: PropertyRouterConfig) => {
  const { propertyService } = config
  const tokenProvider = new TokenProvider();

  return new Elysia()
    .use(authMiddleware(tokenProvider))
    .get("/", async ({ user: { userId, organizationId } }) => {

      // if organizationId is null | undefined,
      // send back the properties without organization authored by user

      const result = await propertyService.list({
        userId: userId,
        options: {
          filters: {
            authorId: userId
          }
        }
      });

      return {
        properties: result,
      };
    })
    .post(
      "/",
      async ({ user, body }) => {
        if (!user) {
          throw new AppError({
            message: "unauthorized",
            statusCode: 403,
          });
        }
        const res = await propertyService.create({
          userId: user.userId,
          orgId: undefined,
          payload: {
            ...body,
          },
        });

        return res;
      },
      {
        body: createPropertySchema,
      },
    )
    .group("/:id", (app) =>
      app
        .derive(async ({ params: { id } }) => {
          const property = await propertyService.getById({ propertyId: id });

          if (!property) {
            throw new AppError({
              message: `property with id: ${id} not found`,
              statusCode: 404,
            });
          }
          return {
            property,
          };
        })
        .get("/", async ({ property }) => {
          return property;
        })
        .delete("/", async ({ property }) => {
          await propertyService.delete({ propertyId: property.id });

          return {
            message: "success",
            statusCode: 204,
          };
        })
        .patch("/", async ({ property, body }) => {
          await propertyService.update({ propertyId: property.id, payload: body  })

        }, {
          body: createPropertySchema,
        })

    );
};
