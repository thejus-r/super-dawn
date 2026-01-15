import { Elysia, t } from "elysia";
import { AppError } from "@/shared/utils/AppError";
import type { IAuthService } from "../../domain/auth.domain";
import { TokenProvider } from "../../infrastructure/providers/token.provider";
import { createUserSchema, loginUserSchema } from "../dto/auth.dto";
import { authMiddleware } from "./auth.middleware";

export const createAuthRouter = (authService: IAuthService) => {
  return new Elysia()
    .post(
      "/login",
      async ({ body, cookie: { refresh_token } }) => {
        const { accessToken, refreshToken, user } =
          await authService.loginUser(body);

        refresh_token.set({
          value: refreshToken,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
          httpOnly: true,
          sameSite: "strict",
        });
        return Response.json({
          user,
          accessToken,
        });
      },
      {
        cookie: t.Cookie({
          refresh_token: t.Optional(t.String()),
        }),
        body: loginUserSchema,
      },
    )
    .post(
      "/register",
      async ({ body, cookie: { refresh_token } }) => {
        const { refreshToken, accessToken, user } =
          await authService.createUser(body);

        refresh_token.set({
          value: refreshToken,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
          httpOnly: true,
          sameSite: "strict",
        });

        return Response.json({
          accessToken,
          user,
        });
      },
      {
        cookie: t.Cookie({
          refresh_token: t.Optional(t.String()),
        }),
        body: createUserSchema,
      },
    )
    .get(
      "/refresh",
      async ({ cookie: { refresh_token } }) => {
        if (!refresh_token.value) {
          throw new AppError({
            message: "no refresh token present in cookie",
            statusCode: 403,
            code: "NO_COOKIE",
          });
        }

        const { refreshToken, accessToken, user } =
          await authService.refreshTokens(refresh_token.value);

        refresh_token.set({
          value: refreshToken,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
          httpOnly: true,
          sameSite: "strict",
        });
        return Response.json({
          accessToken,
          user,
        });
      },
      {
        cookie: t.Cookie({
          refresh_token: t.Optional(t.String()),
        }),
      },
    )
    .use(authMiddleware(new TokenProvider()))
    .get("/me", async ({ user }) => {
      return Response.json({
        user,
      });
    });
};
