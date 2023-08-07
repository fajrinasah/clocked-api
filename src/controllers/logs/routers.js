import { Router } from "express";

import { verifyUser } from "../../middlewares/index.js";
import * as logsControllers from "./index.js";

const router = Router();

/*------------------------------------------------------------
GET
-------------------------------------------------------------*/
router.get("", verifyUser, logsControllers.getOwnAttendanceLogs);

/*------------------------------------------------------------
PATCH
-------------------------------------------------------------*/
router.patch("/clocked-time", verifyUser, logsControllers.clockedInOut);

export default router;