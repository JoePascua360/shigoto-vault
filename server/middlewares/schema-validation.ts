import type { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod/v4";
import { StatusCodes } from "http-status-codes";
import { ApplicationError } from "~/errors/ApplicationError";

export const schemaValidation = (schema: z.ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
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
