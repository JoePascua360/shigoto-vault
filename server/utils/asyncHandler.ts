import type { Request, Response, NextFunction, RequestHandler } from "express";
/**
 * Asynchronous function handler for wrapping controller functions 
 * in a specific domain module to avoid writing try catch block every time.
 *
 * @param fn - Controller function is passed here
 *
 * @example
 * //job-application.route.ts
 * import express from "express";
 * import { jobApplicationController } from "./job-application.controller";
 * import { asyncHandler } from "~/utils/asyncHandler";
 *
 * const jobApplicationRoute = express.Router();
 * 
 * jobApplicationRoute.get(
 * "/loadJobApplicationData",
 * asyncHandler(jobApplicationController.get)
 * );

 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
}
