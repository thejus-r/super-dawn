import { Elysia } from "elysia";
import type { IPropertyService } from "../../domain/entity/property.entity";
import { TokenProvider } from "@/modules/identity/infrastructure/providers/token.provider";
import { authMiddleware } from "@/shared/middleware/auth-middleware";
import { AppError } from "@/shared/utils/AppError";
import { createPropertySchema } from "../dto/property.dto";

export const createPropertyRouter = ({
  propertyService,
}: {
  propertyService: IPropertyService;
}) => {
  const tokenProvider = new TokenProvider();

  return new Elysia()
    .use(authMiddleware(tokenProvider))
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
    .get("/", async ({ user }) => {
      const userId = user!.userId;

      const result = await propertyService.list({ userId });

      return {
        properties: result,
      };
    });
};
