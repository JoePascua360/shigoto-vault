import type { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import { version } from "../../package.json";

const apiVersion = process.env.VITE_API_VERSION;

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.1.1",
    info: {
      title: "Shigoto Vault REST API Docs",
      version,
    },
    servers: [
      {
        url: `/api/${apiVersion}`,
      },
    ],
    license: {
      name: "Licensed Under MIT",
      url: "https://spdx.org/licenses/MIT.html",
    },
  },
  apis: ["./server/**/*.ts", "./shared/**/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app: Express, port: number) => {
  app.use(
    "/api/docs",
    swaggerUI.serve,
    swaggerUI.setup(swaggerSpec, {
      customSiteTitle: "Docs | Shigoto Vault",
      customfavIcon: "/vault-icon.svg",
    })
  );

  app.get("/docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
    return;
  });

  console.log(`REST API Docs available at http://localhost:${port}/api/docs`);
};

export default swaggerDocs;
