import { Router } from "express";

import { verifyAdmin, verifyUser } from "../../middlewares/index.js";
import * as salariesControllers from "./index.js";

const router = Router();

/*------------------------------------------------------------
POST
-------------------------------------------------------------*/
router.post("", verifyAdmin, salariesControllers.setSalary);

/*------------------------------------------------------------
GET
-------------------------------------------------------------*/
router.get("", verifyUser, salariesControllers.getOwnPayrollReports);

export default router;
