import { Express } from "express";

import { userRoutes } from "./user.route";
import { doctorRouter } from "./doctor.route";
import { scheduleRouter } from "./schedule.route";
import { appointmentRouter } from "./appointment.route";

import * as authMiddleware from "../../../middlewares/auth.middleware";
import { medicalRecordRouter } from "./medical-record.route";

export const routeApiV1 = (app: Express): void => {
  const version = "/api/v1";

  app.use(version + "/users", userRoutes);

  app.use(version + "/doctors", authMiddleware.verifyToken, doctorRouter);

  app.use(version + "/schedules", authMiddleware.verifyToken, scheduleRouter);

  app.use(version + "/appointments", authMiddleware.verifyToken, appointmentRouter);

  app.use(version + "/medical-records", authMiddleware.verifyToken, medicalRecordRouter)
};
