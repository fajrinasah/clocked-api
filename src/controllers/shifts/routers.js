import { Router } from "express";

import { verifyAdmin } from "../../middlewares/index.js";
import * as shiftsControllers from "./index.js";

const router = Router();

/*------------------------------------------------------------
POST
-------------------------------------------------------------*/
router.post("/new-shift", verifyAdmin, shiftsControllers.addShift);
router.post("/new-schedule", verifyAdmin, shiftsControllers.setShift);

/*------------------------------------------------------------
GET
-------------------------------------------------------------*/
router.get("", verifyAdmin, shiftsControllers.getAllShifts);

export default router;
