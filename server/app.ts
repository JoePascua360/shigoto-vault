import "react-router";
import { createRequestHandler } from "@react-router/express";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import * as db from "~/db/index";
import { toNodeHandler } from "better-auth/node";
import { auth } from "#/lib/auth";
import jobApplicationRoute from "./src/job-applications/job-application.route";
import { handleError } from "~/errors/handleError";
import { GlobalConfigs } from "./config/global-config";
import morgan from "morgan";
import type { Context } from "./config/Context";
import { checkUserSession } from "~/middlewares/check-user-session";
import swaggerDocs from "./utils/swagger";

declare module "react-router" {
  interface AppLoadContext {
    VALUE_FROM_EXPRESS: string;
    database: typeof db;
  }
}

// used to extend express request object
declare global {
  namespace Express {
    interface Request {
      context: Context;
    }
  }
}

export const app = express();

const apiVersion = GlobalConfigs.apiVersion;

swaggerDocs(app);

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

// call routes before request handler to avoid pending errors

app.use(`/api/${apiVersion}/account`, morgan("dev"), checkUserSession);

app.use(
  `/api/${apiVersion}/job-applications`,
  morgan("dev"),
  checkUserSession,
  jobApplicationRoute
);

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
