import type { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod/v4";
import { StatusCodes } from "http-status-codes";

export const schemaValidation = (schema: z.ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Invalid data found.", details: errorMessages });
        return;
      } else if (error instanceof Error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: `Internal Server Error ${error.message}` });
        return;
      }
    }
  };
};
