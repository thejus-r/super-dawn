import { Elysia } from "elysia";
import { TokenProvider } from "@/modules/identity/infrastructure/providers/token.provider";
import { authMiddleware } from "@/shared/middleware/auth-middleware";
import { AppError } from "@/shared/utils/AppError";
import type { OrganizationService } from "../../service/organization";
import { createOrganizationSchema } from "../dto/organization.dto";

export const createOrganizationRouter = ({
  organizationService
} : {
  organizationService: OrganizationService
}) => {

  const tokenProvider = new TokenProvider()
  return new Elysia()
    .use(authMiddleware(tokenProvider))
    .post("/", async ({ body, user }) => {

      if (!user) {
        throw new AppError({
          message: "no access",
          statusCode: 403
        })
      }
      const newOrg = await organizationService.createOrganization(user.userId, body)
      return Response.json({
        organization: newOrg,
      });
    },
    {
      body: createOrganizationSchema
    }
    );
};
