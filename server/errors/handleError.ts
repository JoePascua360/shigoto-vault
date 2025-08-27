import type { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ApplicationError } from "./ApplicationError";

/**
 * Global error handler - This function will catch all errors in the application
 */
export const handleError = (err: Error, res: Response) => {
  console.error(err);

  if (err instanceof ApplicationError) {
    res
      .status(err.statusCode)
      .json({ message: `Application Error! ${err.message}` });
    return;
  }

  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: `Server Error! ${err.message}` });
  return;
};
