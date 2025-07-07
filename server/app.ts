import "react-router";
import { createRequestHandler } from "@react-router/express";
import express from "express";
import { setupRouters } from "~/routers/setup-routers";
import * as db from "~/db/index";
import { toNodeHandler } from "better-auth/node";
import { auth } from "#/lib/auth";

declare module "react-router" {
  interface AppLoadContext {
    VALUE_FROM_EXPRESS: string;
    database: typeof db;
  }
}

export const app = express();

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

// call routes before request handler to avoid pending errors

setupRouters();

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
