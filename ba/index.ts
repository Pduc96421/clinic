import express, { Express, Response, Request } from "express";
import * as database from "./config/database";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

import { routeApiV1 } from "./api/v1/routes/index.route";

const app: Express = express();
const port: number | string = process.env.PORT;
const corsOptions: object = { origin: process.env.CORS_ORIGIN };

database.connect();

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(bodyParser.json());
app.use(cors(corsOptions));

routeApiV1(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
