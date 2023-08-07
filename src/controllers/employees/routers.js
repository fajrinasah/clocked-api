import { Router } from "express";

import { verifyAdmin } from "../../middlewares/index.js";
import * as employeesControllers from "./index.js";

const router = Router();

/*------------------------------------------------------------
POST
-------------------------------------------------------------*/
router.post("/new-employee", verifyAdmin, employeesControllers.addEmployee);

export default router;
