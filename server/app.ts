import "react-router";
import { createRequestHandler } from "@react-router/express";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { setupRouters } from "~/routers/setup-routers";
import * as db from "~/db/index";
import { toNodeHandler } from "better-auth/node";
import { auth } from "#/lib/auth";
import jobApplicationRoute from "./job-applications/job-application.route";
import { StatusCodes } from "http-status-codes";
import { handleError } from "~/errors/handleError";
import { GlobalConfigs } from "./config/global-config";
import morgan from "morgan";
declare module "react-router" {
  interface AppLoadContext {
    VALUE_FROM_EXPRESS: string;
    database: typeof db;
  }
}

export const app = express();

const apiVersion = GlobalConfigs.apiVersion;

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

// call routes before request handler to avoid pending errors

// setupRouters();

app.use(`/api/${apiVersion}/`, morgan("dev"), jobApplicationRoute);

// catch all error
app.use(async (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  handleError(err, res);
});

app.use(
  createRequestHandler({
    build: () => import("virtual:react-router/server-build"),
    getLoadContext() {
      return {
        VALUE_FROM_EXPRESS: "Hello from Express",
        database: db,
      };
    },
  })
);
