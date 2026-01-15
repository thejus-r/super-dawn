import Elysia from "elysia";
import type { AuthService } from "../../services/auth.service";
import { createAuthRouter } from "./auth.router";

export const createIdentityModule = (authService: AuthService) => {
	const authRouter = createAuthRouter(authService);
	return new Elysia({ prefix: "/identity" }).use(authRouter);
};
