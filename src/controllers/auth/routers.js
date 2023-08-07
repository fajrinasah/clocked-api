import { Router } from "express";

import { verifyUser } from "../../middlewares/index.js";
import * as authControllers from "./index.js";

const router = Router();

/*------------------------------------------------------------
POST
-------------------------------------------------------------*/
router.post("/login", authControllers.login);
router.post("/verification/:uuidWithContext", authControllers.verifyOtp);

/*------------------------------------------------------------
GET
-------------------------------------------------------------*/
router.get("/keep-login", verifyUser, authControllers.keepLogin);

/*------------------------------------------------------------
PATCH
-------------------------------------------------------------*/
router.patch(
  "/activation-data/:uuidWithContext",
  authControllers.saveEmployeeData
);

export default router;
