import { Express } from "express";

import * as authMiddleware from "../../../middlewares/auth.middleware";
import * as validateAuthorization from "../../../validates/authorization.validate";

import { userRoutes } from "./user.route";
import { doctorRouter } from "./doctor.route";
import { scheduleRouter } from "./schedule.route";
import { appointmentRouter } from "./appointment.route";
import { medicalRecordRouter } from "./medical-record.route";
import { prescriptionRouter } from "./prescription.route";
import { feedbackRouter } from "./feedback.route";
import { statsRouter } from "./stats.route";

export const routeApiV1 = (app: Express): void => {
  const version = "/api/v1";

  app.use(version + "/users", userRoutes);

  app.use(version + "/doctors", authMiddleware.verifyToken, doctorRouter);

  app.use(version + "/schedules", authMiddleware.verifyToken, scheduleRouter);

  app.use(version + "/appointments", authMiddleware.verifyToken, appointmentRouter);

  app.use(version + "/medical-records", authMiddleware.verifyToken, medicalRecordRouter);

  app.use(version + "/prescriptions", authMiddleware.verifyToken, prescriptionRouter);

  app.use(version + "/feedbacks", authMiddleware.verifyToken, feedbackRouter);

  app.use(version + "/stats", authMiddleware.verifyToken, validateAuthorization.denyRoles(["patient"]), statsRouter);
};
