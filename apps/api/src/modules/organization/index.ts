import Elysia from "elysia";
import { TokenProvider } from "../identity/infrastructure/providers/token.provider";
import { authMiddleware } from "../identity/transport/http/auth.middleware";

const tokenProvider = new TokenProvider();

export const organizationModule = new Elysia({
  prefix: "organization",
})
  .use(authMiddleware(tokenProvider))
  .get("/", ({ user }) => {
    return {
      status: "ok",
      secret: {
        data: "good",
        user: user,
      },
    };
  });
