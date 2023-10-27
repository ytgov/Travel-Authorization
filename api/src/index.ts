import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import helmet from "helmet";

import * as config from "./config";
import { CreateMigrationRoutes } from "./data";

import {
  userRouter,
  managerRouter,
  lookupRouter,
  healthCheckRouter,
  formRouter,
  preapprovedRouter,
  travelDeskRouter,
  travComRouter,
  reconcileRouter,
  lookupTableRouter
  // tmpTravComRouter,
} from "./routes";
import routes from "./routes";
import { checkJwt, loadUser } from "./middleware/authz.middleware";

var knex = require("knex");
var fileupload = require("express-fileupload");

const app = express();

app.use(express.json()); // for parsing application/json
app.use(
  express.urlencoded({
    extended: true
  })
); // for parsing application/x-www-form-urlencoded

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "default-src": ["'self'", "https://dev-0tc6bn14.eu.auth0.com"],
      "base-uri": ["'self'"],
      "block-all-mixed-content": [],
      "font-src": ["'self'", "https:", "data:"],
      "frame-ancestors": ["'self'"],
      "img-src": ["'self'", "data:", "https:"],
      "object-src": ["'none'"],
      "script-src": ["'self'", "https://js.arcgis.com", "'unsafe-eval'"], // added https to accomodate esri components?
      "script-src-attr": ["'none'"],
      "style-src": ["'self'", "https:", "'unsafe-inline'"],
      "worker-src": ["'self'", "blob:"],
      "connect-src": ["'self'", "https://dev-0tc6bn14.eu.auth0.com"]
    }
  })
);

app.use(
  cors({
    origin: config.FRONTEND_URL,
    optionsSuccessStatus: 200,
    credentials: true
  })
);

CreateMigrationRoutes(app);

// app.get('/api/healthCheck', (req: Request, res: Response) => {
// 	res.send('API is up!');
// });

console.log("host: ", process.env.DB_HOST);
console.log("user: ", process.env.DB_USER);
console.log("psss: ", "*********");
console.log("db name: ", process.env.DB_NAME);

var conn = knex({
  client: "mssql",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    options: {
      enableArithAbort: true
    }
  },
  useNullAsDefault: true
});

app.set("db", conn);

// accepts FormData
app.use(fileupload());

app.use("/api/form", checkJwt, loadUser, formRouter);
app.use("/api/user", checkJwt, loadUser, userRouter);
app.use("/api/manager", checkJwt, loadUser, managerRouter);
app.use("/api/preapproved", checkJwt, loadUser, preapprovedRouter);
app.use("/api/traveldesk", checkJwt, loadUser, travelDeskRouter);

app.use("/api/travCom", checkJwt, loadUser, travComRouter);
app.use("/api/reconcile", checkJwt, loadUser, reconcileRouter);
// app.use("/api/travel-com", checkJwt, loadUser, tmpTravComRouter);

app.use("/api/lookup", lookupRouter);
app.use("/api/lookup-tables", lookupTableRouter);

app.use("/api/healthCheck", healthCheckRouter);
 // TODO: move all routes to the same file, using simplified binding syntax for easier lookups
app.use(routes)

// serves the static files generated by the front-end
app.use(express.static(path.join(__dirname, "web")));

// if no other routes match, just send the front-end
app.use((req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "web") + "/index.html");
});

app.listen(config.API_PORT, () => {
  console.log(`API listening on port ${config.API_PORT}`);
});
