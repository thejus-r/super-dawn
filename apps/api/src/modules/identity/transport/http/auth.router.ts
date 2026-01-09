import { Elysia, t } from 'elysia';
import type { IAuthService } from '../../domain/auth.domain';
import { createUserSchema } from '../dto/auth.dto';

export const createAuthRouter = (authService: IAuthService) => {
  return new Elysia()
    .post("/login", async ({ body, cookie: { refresh_token } }) => {

      const { accessToken, refreshToken, user } = await authService.loginUser(body)

      refresh_token.set({
        value: refreshToken,
        expires: new Date(Date.now() + 3600000),
        httpOnly: true,
        sameSite: "strict"
      })
      return Response.json({
        user,
        accessToken
      })
    }, {
      cookie: t.Cookie({
        refresh_token: t.Optional(t.String())
      }),
      body: createUserSchema
    })
    .post("/register", async ({ body, cookie: { refresh_token } }) => {

      const {refreshToken, accessToken, user } = await authService.createUser(body)

      refresh_token.set({
        value: refreshToken,
        expires: new Date(Date.now() + 3600),
        httpOnly: true,
        sameSite: "strict"
      })

      return Response.json({
        accessToken,
        user
      })
    }, {
      cookie: t.Cookie({
        refresh_token: t.String()
      }),
      body: createUserSchema
    })
    .get("/refresh", async ({ cookie: { refresh_token } }) => {
      if (!refresh_token.value) {
        throw new Error("no refresh token present in cookie")
      }

      const { refreshToken, accessToken, user } = await authService.refreshTokens(refresh_token.value)

      refresh_token.set({
        value: refreshToken,
        expires: new Date(Date.now() + 3600),
        httpOnly: true,
        sameSite: "strict"
      })
      return Response.json({
        accessToken,
        user
      })


    }, {
      cookie: t.Cookie({
        refresh_token: t.Optional(t.String())
      }),
    })

}
