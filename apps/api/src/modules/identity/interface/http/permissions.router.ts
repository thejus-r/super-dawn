import Elysia, { t } from "elysia"
import { TokenProvider } from "../../infrastructure/providers/token.provider";
import type { AccessControlService } from "../../services/access-control.service"
import { authMiddleware } from "./auth.middleware";

export const createPermissionRouter = (accessControl: AccessControlService) => {

  const tokenProvider = new TokenProvider();
  return new Elysia()
    .use(authMiddleware(tokenProvider))
    .get("/permissions", async ({ query, user }) => {
      const { orgId } = query
      if (!user || !orgId) {
        return {
          role: null,
          permissions: []
        }
      }
      return await accessControl.getPermissions(user.userId, orgId)
    }, {
      query: t.Object({
        orgId: t.Optional(t.String())
      })
    })
}
