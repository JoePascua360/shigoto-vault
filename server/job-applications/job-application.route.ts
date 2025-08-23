import express from "express";
import { jobApplicationController } from "./job-application.controller";
import { asyncHandler } from "~/utils/asyncHandler";

const jobApplicationRoute = express.Router();

jobApplicationRoute.get(
  "/loadJobApplicationData",
  asyncHandler(jobApplicationController.get)
);

export default jobApplicationRoute;
