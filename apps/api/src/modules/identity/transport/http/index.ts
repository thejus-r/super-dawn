import Elysia from "elysia"
import { AuthRepository } from "../../infrastructure/repository/auth.repository"
import { AuthService } from "../../services/auth.service"
import { createAuthRouter } from "./auth.router"
import { db } from "@/db"
import { SessionRepository } from "../../infrastructure/repository/session.repository"

export const createIdentityModule = () => {

  const authRepo = new AuthRepository(db)
  const sessionRepo = new SessionRepository(db)

  const authService = new AuthService(authRepo, sessionRepo)
  const authRouter = createAuthRouter(authService);

  return new Elysia({ prefix: "/identity" })
    .use(authRouter)
}
