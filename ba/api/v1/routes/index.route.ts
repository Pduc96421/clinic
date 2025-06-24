import { Express } from "express";

import { userRoutes } from "./user.route";
import { doctorRouter } from "./doctor.route";
import { scheduleRouter } from "./schedule.route";

export const routeApiV1 = (app: Express): void => {
  const version = "/api/v1";

  app.use(version + "/users", userRoutes);

  app.use(version + "/doctors", doctorRouter);

  app.use(version + "/schedules", scheduleRouter);
};
