/*-------------------------------------------------------*/
// IMPORT FROM DEPENDENCIES
/*-------------------------------------------------------*/
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import chalk from "chalk";

/*-------------------------------------------------------*/
// IMPORT FROM LOCAL (SRC)
/*-------------------------------------------------------*/
import * as helpers from "./src/helpers/index.js";
import * as middlewares from "./src/middlewares/index.js";
import * as routers from "./src/controllers/routers/index.js";

/*-------------------------------------------------------*/
// DEPENDENCIES CONFIGURATIONS
/*-------------------------------------------------------*/
const app = express();
dotenv.config();

/*-------------------------------------------------------*/
// USAGE CONFIGURATIONS
/*-------------------------------------------------------*/
app.use(bodyParser.json());
app.use(cors({ exposedHeaders: "Authorization" }));
app.use(middlewares.requestLogger);

/*-------------------------------------------------------*/
// TEST CONNECTION
/*-------------------------------------------------------*/
helpers.connectors.redisConnector();
helpers.connectors.sequelizeConnector();

/*-------------------------------------------------------*/
// DEFINE ROOT ROUTE
/*-------------------------------------------------------*/
app.get("/api", (req, res) => {
  res.status(200).send("<h1> Connected to clocked API successfully. </h1>");
});

/*-------------------------------------------------------*/
// USE ROUTERS
/*-------------------------------------------------------*/
app.use("/api/auth", routers.authRouters);
app.use("/api/employees", routers.employeesRouters);
app.use("/api/shifts", routers.shiftsRouters);
app.use("/api/logs", routers.logsRouters);

/*-------------------------------------------------------*/
// USE ERROR HANDLER
/*-------------------------------------------------------*/
app.use(middlewares.errorHandler);

/*-------------------------------------------------------*/
// LISTEN TO PORT
/*-------------------------------------------------------*/
const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(chalk.bgGreenBright("Server running") + ` on port ${PORT}`)
);
