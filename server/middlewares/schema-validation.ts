import type { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod/v4";
import { StatusCodes } from "http-status-codes";
import { ApplicationError } from "~/errors/ApplicationError";

/**
 *
 * Middleware for validating the request body schema using zod before reaching the endpoint.
 *
 * @param schema - zod object schema
 * @param isFileUpload - Default value is false. Change to true for endpoint that requires file upload for validation
 */
export const schemaValidation = (
  schema: z.ZodObject,
  isFileUpload: boolean = false
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(isFileUpload ? req.file : req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue) => ({
          message: `${issue.path.join(".")}: ${issue.message}`,
        }));

        throw new ApplicationError(
          `Invalid data found. ${errorMessages.map(
            (text) => ` ${text.message}`
          )}`,
          StatusCodes.BAD_REQUEST
        );
      } else if (error instanceof Error) {
        throw new ApplicationError(
          `Server Error! ${error.message}`,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
        return;
      }
    }
  };
};
