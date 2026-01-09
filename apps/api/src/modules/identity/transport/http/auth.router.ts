import { Elysia } from 'elysia';
import type { IAuthService } from '../../domain/auth.domain';
import { createUserSchema } from '../dto/auth.dto';

export const createAuthRouter = (authService: IAuthService) => {
  return new Elysia()
    .post("/login", async ({ body }) => {

      const user = await authService.loginUser(body)

      return Response.json({
        user
      })
    }, {
      body: createUserSchema
    })
    .post("/register", async ({ body }) => {

      const user = await authService.createUser(body)
      return Response.json({
        user
      })
    }, {
      body: createUserSchema
    })

}
