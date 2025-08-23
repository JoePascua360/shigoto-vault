import type { Response } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * Global error handler - This function will catch all errors in the application
 */
export const handleError = (err: Error, res: Response) => {
  console.error(err);
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: `Server Error! ${err.message}` });
  return;
};
