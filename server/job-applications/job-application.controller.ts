import { auth } from "#/lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import type { Request, Response } from "express";
import { jobApplicationService } from "~/job-applications/job-application.service";

export const jobApplicationController = {
  get: async (req: Request, res: Response) => {
    const query = req.query;

    const company_name = String(query.company_name);
    const tableName = String(query.colName);

    const searchEnabled = query.searchEnabled === "true";

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    const data = await jobApplicationService.loadJobApplicationData(
      company_name,
      tableName,
      searchEnabled,
      session
    );

    res.status(200).json({ message: "Loaded successfully!", rows: data });
    return;
  },
};
