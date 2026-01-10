import { Elysia } from "elysia";
import { AppError } from "../utils/AppError";

export const appErrorHandler = () =>
  new Elysia()
    .error({
      AppError,
    })
    .onError(({ code, error, set }) => {
      if (error instanceof AppError) {
        set.status = error.statusCode;
        return Response.json({
          success: false,
          message: error.message,
          code: error.code || "APP_ERROR",
        });
      }

      switch (code) {
        case "VALIDATION": {
          set.status = 400;
          return Response.json({
            success: false,
            message: "validation failed",
            code: "VALIDATION_FAILED",
            errors: error.all,
          });
        }

        case "NOT_FOUND": {
          set.status = 404;
          return Response.json({
            success: false,
            message: "resource not found",
          });
        }

        case "PARSE": {
          set.status = 400;
          return Response.json({
            success: false,
            message: "faild to parse data",
          });
        }

        default: {
          set.status = 500;
          return Response.json({
            success: false,
            message: "internal server error",
          });
        }
      }
    });
