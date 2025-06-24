import { Express } from "express";

import { userRoutes } from "./user.route";

export const routeApiV1 = (app : Express) : void => {
  const version = "/api/v1";

  app.use(version + "/users", userRoutes);
};
