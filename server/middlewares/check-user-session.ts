import { auth } from "#/lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { Context } from "~/config/Context";
import { ApplicationError } from "~/errors/ApplicationError";

/**
 * Checks whether the user has an account and save the session object in req.context
 */
export const checkUserSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session?.user) {
    throw new ApplicationError(
      "You must be logged in to perform this action.",
      StatusCodes.UNAUTHORIZED
    );
  }

  req.context = new Context(session);

  next();
};
