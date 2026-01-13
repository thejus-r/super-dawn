import type { Elysia } from "elysia";
import { AppError } from "@/shared/utils/AppError";
import type { ITokenProvider } from "../../domain/ports/token-provider";

export const authMiddleware =
	(tokenProvider: ITokenProvider) => (app: Elysia) =>
		app.derive({ as: "global" }, async ({ headers }) => {
			const authHeader = headers["authorization"];

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
			} catch (err) {
				throw new AppError({
					message: "Invalid Access Token",
					statusCode: 401,
					code: "UNAUTHORIZED",
				});
			}
		});
