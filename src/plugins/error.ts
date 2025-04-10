import { Elysia } from "elysia";
import { StatusCodes } from "http-status-codes";

// Define the custom error classes
class ConflictError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.status = StatusCodes.CONFLICT;
    this.name = "ConflictError";
  }
}

class UnauthorizedError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.status = StatusCodes.UNAUTHORIZED;
    this.name = "UnauthorizedError";
  }
}

// Define the error response type
type ErrorResponse<T> = {
  message: string;
  code: T;
};

export default (app: Elysia) =>
  app
    .error({ ConflictError, UnauthorizedError })
    .onError((handler): ErrorResponse<number> => {
      if (
        handler.error instanceof ConflictError ||
        handler.error instanceof UnauthorizedError
      ) {
        handler.set.status = handler.error.status;

        return {
          message: handler.error.message,
          code: handler.error.status,
        };
      }

      if (handler.code === "NOT_FOUND") {
        handler.set.status = StatusCodes.NOT_FOUND;
        return {
          message: "Not Found!",
          code: handler.set.status,
        };
      }

      if (handler.code === "VALIDATION") {
        handler.set.status = StatusCodes.BAD_REQUEST;
        return {
          message: "Bad Request!",
          code: handler.set.status,
        };
      }

      handler.set.status = StatusCodes.SERVICE_UNAVAILABLE;

      return {
        message: "Server Error!",
        code: handler.set.status,
      };
    });

// Export the error classes for use in other files
export { ConflictError, UnauthorizedError };
