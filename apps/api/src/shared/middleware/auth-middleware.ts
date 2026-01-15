import type { Elysia } from "elysia";
import type { ITokenProvider } from "@/modules/identity/domain/ports/token-provider";
import { AppError } from "@/shared/utils/AppError";

export const authMiddleware =
	(tokenProvider: ITokenProvider) => (app: Elysia) =>
		app.derive({ as: "global" }, async ({ headers }) => {
			const authHeader = headers.authorization;

			if (!authHeader || !authHeader.startsWith("Bearer ")) {
				throw new AppError({
					message: "Missing or invalid Authorization header",
					statusCode: 401,
					code: "UNAUTHORIZED",
				});
			}
			const token = authHeader.split(" ")[1];

			if (!token) {
				throw new AppError({
					message: "Invalid Access Token",
					statusCode: 401,
					code: "UNAUTHORIZED",
				});
			}

			try {
				const user = await tokenProvider.verifyAccessToken(token);

				return { user };
			} catch {
				throw new AppError({
					message: "Invalid Access Token",
					statusCode: 401,
					code: "UNAUTHORIZED",
				});
			}
		});

export type AuthMiddleware = typeof authMiddleware
